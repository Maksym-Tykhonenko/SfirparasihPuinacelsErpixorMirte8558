import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readHarbors, writeHarbors } from '../reservoir/store';

type HarborCtx = {
  saved: number[];
  toggle: (id: number) => void;
  isSaved: (id: number) => boolean;
  ready: boolean;
};

const Ctx = createContext<HarborCtx>({
  saved: [],
  toggle: () => {},
  isSaved: () => false,
  ready: false,
});

export const HarborProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [saved, setSaved] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancel = false;
    readHarbors().then((list) => {
      if (cancel) return;
      setSaved(list);
      setReady(true);
    });
    return () => {
      cancel = true;
    };
  }, []);

  const toggle = useCallback(
    (id: number) => {
      setSaved((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        writeHarbors(next);
        return next;
      });
    },
    [],
  );

  const isSaved = useCallback((id: number) => saved.includes(id), [saved]);

  const value = useMemo(() => ({ saved, toggle, isSaved, ready }), [saved, toggle, isSaved, ready]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useHarbor = () => useContext(Ctx);
