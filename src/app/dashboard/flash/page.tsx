import FlashcardSystem from './FlashcardSystem';
import PageContainer from '../../../components/layout/page-container';

export const metadata = {
  title: 'Dashboard : Flashcard view'
};

export default function page() {
  return (
  <PageContainer scrollable={true}>
    <FlashcardSystem />
  </PageContainer>

  );
}
