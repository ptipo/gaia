import { ElMessageBox } from 'element-plus';

/**
 * Confirm for deletion
 */
export async function confirmDelete(name: string) {
    try {
        await ElMessageBox.confirm(`确定删除"${name}"吗？`, '删除确认');
        return true;
    } catch {
        return false;
    }
}
