export type AppAboutContentType =
  'general'
  | 'actor'
  | 'entity'
  | 'contribution'
  | 'monetization'
  | 'roadmap';

// ========== commands ============
export type GetAppAboutContentCommand = {
  name: 'get-app-about-content',
  attrs: { contentType: AppAboutContentType },
  requestId: string,
};

// ========== success ============
export type GetAppAboutContentSuccess = string;

// ========== uc-meta ============
export type GetAppAboutContentMeta = {
  name: 'Get App About Content Use Case'
  in: GetAppAboutContentCommand,
  success: GetAppAboutContentSuccess,
  errors: never,
  events: never,
  aRoot: AppAboutArMeta,
}

export type AppAboutArMeta = {
  name: string,
  title: string,
  attrs: { id: string }, // заглушка
  events: never
}
