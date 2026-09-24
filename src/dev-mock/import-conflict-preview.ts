import { useEffect } from 'react';
import { useGachaStore } from '../store/useGachaStore';

const PREVIEW_MESSAGE = '从本次最早官方记录起存在模拟记录（角色活动唤取：37 条模拟记录（2026-05-12 至 2026-07-08））。为避免五星重复和抽数错乱，请先删除或清空这些模拟记录，再先导入官方数据，最后仅补足官方记录之外真正缺失的历史。';

/** 开发环境预览官方导入冲突弹窗：?dev-import-conflict=1 */
export function useDevMockImportConflictPreview(search: string): void {
  const show = useGachaStore((state) => state.showOfficialImportConflict);

  useEffect(() => {
    if (!import.meta.env.DEV || new URLSearchParams(search).get('dev-import-conflict') !== '1') return;
    show(PREVIEW_MESSAGE);
  }, [search, show]);
}
