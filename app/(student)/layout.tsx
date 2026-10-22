import { TopBar } from '@/components/TopBar';
import { getTotalPoints } from '@/server/progress';
import { requireStudentPage } from '@/server/student-session';

export default async function StudentLayout({ children }: LayoutProps<'/'>) {
  const { student } = await requireStudentPage();
  const points = await getTotalPoints(student.id);

  return (
    <>
      <TopBar
        student={{ displayName: student.displayName, partnerName: student.partnerName, points }}
      />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </>
  );
}
