import type { ThesisSetArMeta } from "../../meta";
import type { ThesisSetAttrs } from "../attrs";

// ========== commands ============
export type GetOwnerArThesisSetsCommand = {
  name: 'get-owner-ar-thesis-sets',
  attrs: { ownerId: string },
  requestId: string,
};

// ========== success ============
export type GetOwnerArThesisSetsSuccess = ThesisSetAttrs[];

// ========== uc-meta ============
export type GetOwnerArThesisSetsMeta = {
  name: 'Get Owner Ar Thesis Sets Use Case'
  in: GetOwnerArThesisSetsCommand,
  success: GetOwnerArThesisSetsSuccess,
  errors: never,
  events: never,
  aRoot: ThesisSetArMeta,
}
