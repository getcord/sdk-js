import type { Location, SetPresentOptions } from '@cord-sdk/types';

export interface UpdateUserPresenceVariables
  extends Omit<SetPresentOptions, 'exclusive_within'> {
  /**
   * The organization that the user belongs to.
   */
  organizationID: string;
  /**
   * Sets an "exclusivity region" for the ephemeral presence set by this update.
   * A user can only be present at one location for a given value of exclusiveWithin.
   * If the user becomes present at a different location with the same value of
   * exclusiveWithin, they automatically become no longer present at all other
   * locations with that value of exclusive_within.
   * This is useful to more easily track presence as a user moves among sub-locations.
   * For example, suppose we'd like to track which specific paragraph on a page
   * a user is present. We could make those updates like this:
   *
   * ```json
   * {
   *    "organizationID": "<ORG_ID>",
   *    "location": { "page": "<PAGE_ID>", "paragraph": "<PARAGRAPH_ID>" },
   *    "exclusiveWithin": { "page": "<PAGE_ID>" }
   * }
   * ```
   *
   * As a user moves around a page, their paragraphID will change, while their
   * pageID will remain the same. The above call to setPresent will mark them
   * present at their specific paragraph. However, since every update uses the
   * same exclusiveWithin, each time they are marked present at one paragraph
   * they will become no longer present at their previous paragraph.
   */
  exclusiveWithin?: Location;
  /**
   * The [location](https://docs.cord.com/reference/location) you want the user to be in.
   */
  location: Location;
}
