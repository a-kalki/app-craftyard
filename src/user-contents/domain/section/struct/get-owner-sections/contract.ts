import type { ContentSectionArMeta } from "../../meta";
import type { ContentSectionAttrs } from "../attrs";

// ========== commands ============
export type GetOwnerArContentSectionsCommand = {
  name: 'get-owner-ar-content-sections',
  attrs: { ownerId: string },
  requestId: string,
};

// ========== success ============
export type GetOwnerArContentSectionsSuccess = ContentSectionAttrs[];

// ========== uc-meta ============
export type GetOwnerArContentSectionsMeta = {
  name: 'Get Owner Ar Content Sections Use Case'
  in: GetOwnerArContentSectionsCommand,
  success: GetOwnerArContentSectionsSuccess,
  errors: never,
  events: never,
  aRoot: ContentSectionArMeta,
}
