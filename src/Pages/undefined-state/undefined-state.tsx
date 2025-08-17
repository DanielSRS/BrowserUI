import { BodyLarge, Button, Styled } from '@danielsrs/react-native-sdk';

interface UndefinedStatePageProps {
  onRetry: () => void;
}

export function UndefinedStatePage(props: UndefinedStatePageProps) {
  return (
    <Container>
      <BodyLarge>This is an undefined state.</BodyLarge>
      <Button onPress={props.onRetry}>Retry</Button>
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
