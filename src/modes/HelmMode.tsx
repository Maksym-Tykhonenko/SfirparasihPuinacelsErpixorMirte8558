import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type TabKey = 'routes' | 'harbors' | 'chart' | 'articles' | 'facts' | 'quiz';

type DetailRef =
  | { kind: 'spot'; id: number; fromChart?: boolean }
  | { kind: 'article'; id: number };

type HelmCtx = {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  detail: DetailRef | null;
  openSpot: (id: number, fromChart?: boolean) => void;
  openArticle: (id: number) => void;
  closeDetail: () => void;
};

const Ctx = createContext<HelmCtx>({
  tab: 'routes',
  setTab: () => {},
  detail: null,
  openSpot: () => {},
  openArticle: () => {},
  closeDetail: () => {},
});

export const HelmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tab, setTab] = useState<TabKey>('routes');
  const [detail, setDetail] = useState<DetailRef | null>(null);

  const openSpot = useCallback((id: number, fromChart = false) => {
    setDetail({ kind: 'spot', id, fromChart });
  }, []);
  const openArticle = useCallback((id: number) => {
    setDetail({ kind: 'article', id });
  }, []);
  const closeDetail = useCallback(() => setDetail(null), []);

  const value = useMemo(
    () => ({ tab, setTab, detail, openSpot, openArticle, closeDetail }),
    [tab, detail, openSpot, openArticle, closeDetail],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useHelm = () => useContext(Ctx);
