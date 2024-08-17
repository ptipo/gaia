import { ElMessageBox } from 'element-plus';

/**
 * Confirm for deletion
 */
export async function confirmDelete(message: string, title: string) {
    try {
        await ElMessageBox.confirm(message, title);
        return true;
    } catch {
        return false;
    }
}
