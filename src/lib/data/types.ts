import type { Listing, Area, Agent, Permit, Media } from "@/payload-types";

export type { Listing, Area, Agent, Permit, Media };

/**
 * A listing with its relationships resolved — what Payload returns at
 * depth 1. Pages are written against this rather than raw `Listing`, whose
 * relationship fields are `number | Area` unions that every consumer would
 * otherwise have to narrow.
 */
export type ListingFull = Omit<Listing, "area" | "agent" | "permit" | "photos"> & {
  area: Area;
  agent: Agent;
  permit: Permit | null;
  photos: Media[];
};

export type ListingFilters = {
  intent?: Listing["intent"];
  propertyType?: Listing["propertyType"];
  bedrooms?: number;
  /** Matches the area itself or anything beneath it in the tree. */
  areaSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  furnished?: NonNullable<Listing["furnished"]>;
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
  limit?: number;
};

/**
 * Mirrors Payload's PaginatedDocs deliberately. Matching the real shape now
 * means the swap from fixtures to `payload.find()` is a body change inside
 * one module, not a rewrite of every page that consumes it.
 */
export type Paginated<T> = {
  docs: T[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
