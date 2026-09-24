import { AlertTriangle } from 'lucide-react';
import { useGachaStore } from '../store/useGachaStore';
import Modal from './Modal';
import ResonanceCloseButton from './ResonanceCloseButton';

export default function OfficialImportConflictDialog() {
  const message = useGachaStore((state) => state.officialImportConflict);
  const close = useGachaStore((state) => state.showOfficialImportConflict);

  return (
    <Modal open={Boolean(message)} onClose={() => close(null)} className="max-w-[560px]" labelledBy="official-import-conflict-title">
      <div className="flex items-start gap-3 border-b border-white/[0.06] p-5">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-amber-300/20 bg-amber-300/[0.07] text-amber-200">
          <AlertTriangle size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="official-import-conflict-title" className="modal-title text-base font-medium text-tide">官方记录与模拟记录冲突</h2>
          <p className="mt-2 text-sm leading-6 text-wave">{message}</p>
        </div>
        <ResonanceCloseButton onClick={() => close(null)} />
      </div>
      <div className="space-y-2 px-5 py-4 text-xs leading-5 text-wave">
        <p>推荐处理顺序：</p>
        <p>1. 先备份数据，再删除异常模拟记录；最稳妥的方式是清空当前 UID 后重新开始。</p>
        <p>2. 重新导入官方记录。</p>
        <p>3. 使用截图补足更早历史时，提前裁剪截图，或在识别结果中删除已存在的重复记录。</p>
      </div>
      <div className="flex justify-end border-t border-white/[0.06] p-4">
        <button type="button" autoFocus onClick={() => close(null)} className="tide-btn h-9 px-5 text-sm">我知道了</button>
      </div>
    </Modal>
  );
}
