// pages/form/[id].js

import { useRouter } from 'next/router'
import DynamicForm from '@/components/(form)/dynamicForm';

export default function FormPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!id) return <div>Loading...</div>;

    return <DynamicForm formId={id} />;
}