import React from "react";
import type { AdminViewServerProps } from "payload";
import {
  AlertTriangle, Clock, FileWarning, ImageOff, MessageSquare, ShieldCheck,
} from "lucide-react";

import { brand } from "@/lib/brand";
import "./dashboard.css";

/**
 * The admin landing view.
 *
 * Payload's default lists collections, which answers "what is in this
 * system" — a question the owner already knows the answer to. This answers
 * "what needs doing", which is why they opened it.
 *
 * Deliberately not a wall of stat cards. A one-person brokerage does not
 * log in to read that it has 47 listings; it logs in because something
 * needs chasing. So the top of the page is a single prioritised worklist
 * and the counts sit underneath it, compact, where they belong.
 *
 * ── Written blind ─────────────────────────────────────────────────────
 * No database exists yet, so this is typechecked but never rendered. The
 * risk sits in the queries and in how it looks inside Payload's shell,
 * neither of which a typecheck covers.
 */

const DAY = 24 * 60 * 60 * 1000;

type Severity = "critical" | "warning" | "info" | "good";

type Task = {
  id: string;
  severity: Severity;
  icon: React.ReactNode;
  title: React.ReactNode;
  meta?: string;
  when?: string;
};

const daysUntil = (d: string | Date) =>
  Math.floor((new Date(d).getTime() - Date.now()) / DAY);

const ago = (d: string | Date) => {
  const h = Math.floor((Date.now() - new Date(d).getTime()) / (60 * 60 * 1000));
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
};

const RANK: Record<Severity, number> = { critical: 0, warning: 1, info: 2, good: 3 };

export async function Dashboard({ initPageResult }: AdminViewServerProps) {
  const { payload, user } = initPageResult.req;

  const [permits, enquiries, agents, published, drafts, noPhotos] = await Promise.all([
    payload.find({ collection: "permits", limit: 500, depth: 1 }),
    payload.find({
      collection: "enquiries",
      where: { status: { equals: "new" } },
      sort: "-createdAt",
      limit: 50,
      depth: 1,
    }),
    payload.find({ collection: "agents", limit: 100, depth: 0 }),
    payload.count({ collection: "listings", where: { _status: { equals: "published" } } }),
    payload.count({ collection: "listings", where: { _status: { equals: "draft" } } }),
    payload.count({
      collection: "listings",
      where: { and: [{ _status: { equals: "published" } }, { photos: { exists: false } }] },
    }),
  ]);

  const tasks: Task[] = [];

  /* ── permits: the thing that carries a fine ───────────────────────── */
  for (const permit of permits.docs) {
    if (!permit.expiresAt) continue;
    const left = daysUntil(permit.expiresAt);
    const listing = typeof permit.listing === "object" ? permit.listing : null;
    const label = listing?.title ?? `Permit ${permit.number}`;

    if (left < 0) {
      tasks.push({
        id: `permit-${permit.id}`,
        severity: "critical",
        icon: <AlertTriangle size={16} aria-hidden />,
        title: listing ? (
          <a href={`/admin/collections/listings/${listing.id}`}>{label}</a>
        ) : (
          label
        ),
        meta: `Permit ${permit.number} lapsed — listing unpublished. Renew in Trakheesi before it can go live again.`,
        when: `${Math.abs(left)}d ago`,
      });
    } else if (left <= 30) {
      tasks.push({
        id: `permit-${permit.id}`,
        severity: "warning",
        icon: <Clock size={16} aria-hidden />,
        title: listing ? (
          <a href={`/admin/collections/listings/${listing.id}`}>{label}</a>
        ) : (
          label
        ),
        meta: `Permit ${permit.number} expires in ${left} day${left === 1 ? "" : "s"}.`,
        when: `${left}d left`,
      });
    }
  }

  /* ── the office's own documents ───────────────────────────────────── */
  const licenceLeft = daysUntil(brand.legal.expires);
  if (licenceLeft <= 120) {
    tasks.push({
      id: "licence",
      severity: licenceLeft < 0 ? "critical" : "warning",
      icon: <ShieldCheck size={16} aria-hidden />,
      title: `Trade licence ${brand.legal.tradeLicence} · ORN ${brand.legal.orn}`,
      meta:
        licenceLeft < 0
          ? "Expired. Every permit underneath it is invalid until renewed."
          : `Expires in ${licenceLeft} days. The broker card and office registration lapse on the same day.`,
      when: licenceLeft < 0 ? "expired" : `${licenceLeft}d left`,
    });
  }

  for (const agent of agents.docs) {
    if (!agent.brnExpiresAt) continue;
    const left = daysUntil(agent.brnExpiresAt);
    if (left > 90) continue;
    tasks.push({
      id: `brn-${agent.id}`,
      severity: left < 0 ? "critical" : "warning",
      icon: <ShieldCheck size={16} aria-hidden />,
      title: `${agent.name} — BRN ${agent.brn}`,
      meta: left < 0 ? "Broker card expired." : `Broker card expires in ${left} days.`,
      when: left < 0 ? "expired" : `${left}d left`,
    });
  }

  /* ── leads: response time is most of the conversion ───────────────── */
  for (const e of enquiries.docs) {
    const hours = (Date.now() - new Date(e.createdAt).getTime()) / (60 * 60 * 1000);
    const listing = typeof e.listing === "object" ? e.listing : null;
    tasks.push({
      id: `enq-${e.id}`,
      severity: hours > 24 ? "critical" : "warning",
      icon: <MessageSquare size={16} aria-hidden />,
      title: <a href={`/admin/collections/enquiries/${e.id}`}>{e.name}</a>,
      meta: [
        e.kind === "valuation" ? "Valuation request" : e.kind === "viewing" ? "Viewing request" : "Enquiry",
        e.phone,
        listing?.title,
      ]
        .filter(Boolean)
        .join(" · "),
      when: ago(e.createdAt),
    });
  }

  /* ── quietly rotting inventory ────────────────────────────────────── */
  if (noPhotos.totalDocs > 0) {
    tasks.push({
      id: "no-photos",
      severity: "info",
      icon: <ImageOff size={16} aria-hidden />,
      title: (
        <a href="/admin/collections/listings?where[_status][equals]=published">
          {noPhotos.totalDocs} published listing{noPhotos.totalDocs === 1 ? "" : "s"} with no photos
        </a>
      ),
      meta: "Photography is the largest single factor in whether a listing converts.",
    });
  }

  if (drafts.totalDocs > 0) {
    tasks.push({
      id: "drafts",
      severity: "info",
      icon: <FileWarning size={16} aria-hidden />,
      title: (
        <a href="/admin/collections/listings?where[_status][equals]=draft">
          {drafts.totalDocs} draft{drafts.totalDocs === 1 ? "" : "s"} not yet published
        </a>
      ),
      meta: "Usually waiting on a Trakheesi permit.",
    });
  }

  tasks.sort((a, b) => RANK[a.severity] - RANK[b.severity]);

  const firstName = typeof user?.name === "string" && user.name ? user.name.split(" ")[0] : null;

  return (
    <div className="dash gutter--left gutter--right">
      <header className="dash__head">
        <h1>{firstName ? `Morning, ${firstName}` : "Today"}</h1>
        <p>
          {tasks.length === 0
            ? "Nothing needs chasing."
            : `${tasks.length} thing${tasks.length === 1 ? "" : "s"} need${tasks.length === 1 ? "s" : ""} attention.`}
        </p>
      </header>

      <section className="dash__section">
        <div className="dash__sectionHead">
          <h2>Needs attention</h2>
          <a href="/admin/collections/enquiries">All enquiries</a>
        </div>

        {tasks.length === 0 ? (
          <div className="dash__empty">
            <strong>All clear.</strong> No permits expiring inside 30 days, no unanswered
            enquiries, nothing published without photos. New enquiries land here the moment
            someone uses a form on the site.
          </div>
        ) : (
          <ul className="dash__list">
            {tasks.map((t) => (
              <li key={t.id} className={`dash__item is-${t.severity}`}>
                <span className="dash__icon">{t.icon}</span>
                <div>
                  <p className="dash__title">{t.title}</p>
                  {t.meta && <p className="dash__meta">{t.meta}</p>}
                </div>
                {t.when && <span className="dash__when">{t.when}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="dash__grid">
        <section className="dash__section">
          <div className="dash__sectionHead">
            <h2>Inventory</h2>
            <a href="/admin/collections/listings">Manage</a>
          </div>
          <dl className="dash__rows">
            <div className="dash__row">
              <dt>Published</dt>
              <dd>{published.totalDocs}</dd>
            </div>
            <div className="dash__row">
              <dt>Drafts</dt>
              <dd>{drafts.totalDocs}</dd>
            </div>
            <div className={`dash__row${noPhotos.totalDocs ? " dash__row--flag" : ""}`}>
              <dt>Published without photos</dt>
              <dd>{noPhotos.totalDocs}</dd>
            </div>
            <div className="dash__row">
              <dt>Permits on file</dt>
              <dd>{permits.totalDocs}</dd>
            </div>
          </dl>
        </section>

        <section className="dash__section">
          <div className="dash__sectionHead">
            <h2>Market data</h2>
          </div>
          <div className="dash__placeholder">
            Recorded DLD transaction prices by area, against your own asking prices — the
            numbers that settle a pricing conversation.
            <br />
            <br />
            Not connected yet. It needs the Dubai Pulse ingestion, which is Phase 3. Left as a
            named gap rather than filled with a chart of nothing.
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
