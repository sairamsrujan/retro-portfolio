// Keep local content paths working on both root and subdirectory hosts.
export const assetUrl = path => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
