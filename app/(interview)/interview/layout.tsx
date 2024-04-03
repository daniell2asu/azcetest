import '~/styles/interview.scss';
import SmallScreenOverlay from './_components/SmallScreenOverlay';

export const metadata = {
  title: 'Network Canvas Fresco - Interview',
  description: 'Interview',
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-[100vh] max-h-[100vh] flex-col bg-[--nc-background] text-[--nc-text]">
      <SmallScreenOverlay />
      {children}
    </main>
  );
}

export default RootLayout;
