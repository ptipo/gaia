import { ElMessageBox } from 'element-plus';

/**
 * Prompt for text input.
 * @param title
 * @param message
 */
export async function prompt(title: string, message: string) {
    const { action, value } = await ElMessageBox.prompt(message, title, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^(?!\s*$).+/,
        inputErrorMessage: '请输入',
    });

    if (action === 'confirm') {
        return value;
    } else {
        return undefined;
    }
}

/**
 * Confirm for deletion.
 */
export async function confirmDelete(message: string) {
    try {
        await ElMessageBox.confirm(message, '确认删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });
        return true;
    } catch {
        return false;
    }
}
