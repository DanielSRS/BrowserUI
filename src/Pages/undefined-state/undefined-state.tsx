import { BodyLarge, Button, Styled } from '@danielsrs/react-native-sdk';

interface UndefinedStatePageProps {
  onRetry: () => void;
  title: string;
}

export function UndefinedStatePage(props: UndefinedStatePageProps) {
  const { onRetry, title } = props;
  return (
    <Container>
      <BodyLarge>{title}</BodyLarge>
      <Button onPress={onRetry}>Retry</Button>
    </Container>
  );
}

const Container = Styled.createStyledView({
  flex: 1,
  backgroundColor: 'rgba(255, 0, 0, 0.1)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 24,
  rowGap: 16,
});
