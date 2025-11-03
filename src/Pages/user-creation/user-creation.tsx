import {
  BodyLarge,
  Button,
  Styled,
  useColors,
} from '@danielsrs/react-native-sdk';
import type { Observable } from '@legendapp/state';
import { Computed, useObservable } from '@legendapp/state/react';
import { useRef } from 'react';
import { Pressable, TextInput, type View } from 'react-native';

interface UserCreationProps {
  onUserCreated: (name: string) => void;
}

/**
 * User creation page
 */
export function UserCreation(props: UserCreationProps) {
  const nameInputRef = useRef<TextInput>(null);
  const focusAreaRef = useRef<View>(null);
  const userName$ = useObservable('');
  const colors = useColors();
  const unfocusTextInput = () => {
    nameInputRef.current?.blur();
    focusAreaRef.current?.focus();
    focusAreaRef.current?.blur();
  };

  const createUser = () => {
    unfocusTextInput();
    props.onUserCreated(userName$.get().trim());
  };
  return (
    <Container>
      <UnfocusInputArea
        ref={focusAreaRef}
        onPress={unfocusTextInput}
        style={unfocusInputAreaStyles}>
        {}
        <NewUserCardContainer
          style={{
            backgroundColor: colors.backgroundFillColorCardBackgroundDefault,
            borderColor: colors.strokeColorSurfaceStrokeDefault,
          }}>
          <Avatar name={userName$} />
          <NameInput
            ref={nameInputRef}
            placeholder="Enter your name"
            placeholderTextColor="gray"
            autoCapitalize="words"
            onChangeText={userName$.set}
            autoCorrect={false}
            returnKeyType="done"
            style={{
              borderColor: colors.controlStrongStrokeDefault,
            }}
          />
          <ButtonContainer>
            <Button onPress={createUser}>Create User</Button>
          </ButtonContainer>
        </NewUserCardContainer>
      </UnfocusInputArea>
    </Container>
  );
}

const Container = Styled.createStyledView({
  flex: 1,
});

const UnfocusInputArea = Pressable;
const unfocusInputAreaStyles = {
  flex: 1,
  //backgroundColor: 'yellow',
  justifyContent: 'center',
  alignItems: 'center',
} as const;

const NewUserCardContainer = Styled.createStyledView({
  borderWidth: 1,
  borderColor: 'blue',
  padding: 16,
  paddingVertical: 24,
  borderRadius: 8,
  rowGap: 20,
  alignItems: 'center',
});

const Avatar = ({ name }: { name: Observable<string> }) => {
  const colors = useColors();
  const textStyle = {
    fontSize: 32,
    lineHeight: 32,
    //backgroundColor: 'blue',
    paddingTop: 6,
    paddingLeft: 3,
    color: colors.textOnAccentPrimary,
  } as const;
  return (
    <AvatarContainer style={{ backgroundColor: colors.accentSecondary }}>
      {/* Avatar content goes here */}
      <BodyLarge style={textStyle}>
        <Computed>{name.get().trim().substring(0, 1).toUpperCase()}</Computed>
      </BodyLarge>
    </AvatarContainer>
  );
};

const AvatarContainer = Styled.createStyledView({
  backgroundColor: 'white',
  width: 72,
  aspectRatio: 1,
  borderRadius: 72,
  justifyContent: 'center',
  alignItems: 'center',
});

const NameInput = Styled.createStyled(TextInput, {
  borderWidth: 1,
  paddingHorizontal: 16,
  paddingVertical: 8,
  minWidth: 240,
  borderRadius: 4,
});

const ButtonContainer = Styled.createStyledView({
  alignSelf: 'flex-end',
});
