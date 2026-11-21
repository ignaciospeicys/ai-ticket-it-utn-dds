import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { api } from "./api";

export function useResource(path, user) {
  const [result, setResult] = useState({});
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);

  useFocusEffect(useCallback(() => {
    if (!path) return;
    let active = true;
    api(path, { user }).then(
      (data) => { if (active) setResult({ path, user, revision, data }); },
      (error) => { if (active) setResult({ path, user, revision, error: error.message }); },
    );
    return () => { active = false; };
  }, [path, user, revision]));

  const ready = result.path === path && result.user === user && result.revision === revision;
  return { ...(ready ? result : { loading: Boolean(path) }), reload };
}
