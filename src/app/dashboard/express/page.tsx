import ExpressPage from './ExpressPage';
import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard : Express Game'
};

export default function page() {
  return (
    <PageContainer scrollable={true}>
    <ExpressPage />
    </PageContainer>
  )
}
