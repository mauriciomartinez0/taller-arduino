import type { Metadata } from 'next';
import { ActionForm } from '@/components/profe/forms';
import { inputClass } from '@/components/profe/styles';
import { Card } from '@/components/ui/Card';
import { changePassword } from '@/server/actions/teacher';

export const metadata: Metadata = { title: 'Cambiar mi contraseña' };

export default function AccountPage() {
  return (
    <div className="max-w-md">
      <h1 className="mb-4 text-2xl">Cambiar mi contraseña</h1>
      <Card>
        <ActionForm action={changePassword} submitLabel="Cambiar contraseña">
          <label className="block">
            <span className="font-semibold">Contraseña actual</span>
            <input
              name="current"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="font-semibold">Nueva contraseña</span>
            <span className="block text-sm text-slate-600">Mínimo 10 caracteres.</span>
            <input
              name="next"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="font-semibold">Repite la nueva contraseña</span>
            <input
              name="confirm"
              type="password"
              required
              autoComplete="new-password"
              className={inputClass}
            />
          </label>
        </ActionForm>
        <p className="mt-4 text-sm text-slate-600">
          Al cambiarla se cierran tus sesiones en otros computadores.
        </p>
      </Card>
    </div>
  );
}
