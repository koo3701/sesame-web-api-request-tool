export type SesameParamType = {
  apiKey: string;
  action: 'unlock' | 'lock' | 'toggle';
  keys: { uuid: string; secret: string }[];
};

export const isSesameParamType = (param: unknown): param is SesameParamType => {
  if (param === null) return false;
  const p = param as Record<string, unknown>;
  return (
    p.apiKey !== undefined &&
    typeof p.apiKey === 'string' &&
    p.action !== undefined &&
    typeof p.action === 'string' &&
    ['unlock', 'lock', 'toggle'].includes(p.action) &&
    p.keys !== undefined &&
    Array.isArray(p.keys) &&
    p.keys.every((key: unknown) => {
      if (key === null) return false;
      const k = key as Record<string, unknown>;
      return (
        k.uuid !== undefined &&
        typeof k.uuid === 'string' &&
        k.secret !== undefined &&
        typeof k.secret === 'string'
      );
    })
  );
};
