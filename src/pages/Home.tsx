import React, { useState } from 'react';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import styled from 'styled-components';

import Heading from 'components/Form/Heading';
import Input from 'components/Form/Input';
import Button from 'components/Form/Button';
import Footer from 'components/misc/Footer';
import FancyBackground from 'components/misc/FancyBackground';

import colors from 'styles/colors';
import { determineAddressType } from 'utils/address-type-checker';

const HomeContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: 'PTMono';
  padding: 0 1rem;
  footer {
    z-index: 1;
  }
`;

const UserInputMain = styled.form`
  background: ${colors.backgroundLighter};
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};
  border-radius: 8px;
  padding: 1rem;
  z-index: 5;
  margin: 1rem;
  width: calc(100% - 2rem);
  max-width: 50rem;
  z-index: 2;
`;

const ErrorMessage = styled.p`
  color: ${colors.danger};
  margin: 0.5rem;
`;

const Home = (): JSX.Element => {
  const defaultPlaceholder = 'e.g. https://intellium.network/';
  const [userInput, setUserInput] = useState('');
  const [errorMsg, setErrMsg] = useState('');
  const [placeholder] = useState(defaultPlaceholder);
  const navigate = useNavigate();

  const submit = () => {
    let address = userInput.trim();
    const addressType = determineAddressType(address);

    if (!address) {
      setErrMsg('Field must not be empty');
    } else if (addressType === 'err') {
      setErrMsg('Must be a valid URL, IPv4, or IPv6 Address');
    } else {
      if (addressType === 'url' && !/^https?:\/\//i.test(address)) {
        address = 'https://' + address;
      }
      const resultRouteParams: NavigateOptions = { state: { address, addressType } };
      navigate(`/results/${encodeURIComponent(address)}`, resultRouteParams);
    }
  };

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
    const isError = ['err'].includes(determineAddressType(event.target.value));
    if (isError) {
      setErrMsg('Must be a valid URL, IPv4, or IPv6 Address');
    } else {
      setErrMsg('');
    }
  };

  const formSubmitEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <HomeContainer>
      <FancyBackground />
      <UserInputMain onSubmit={formSubmitEvent}>
        <Heading as="h1" size="xLarge" align="center" color={colors.primary}>
          <img width="64" src="/web-check.png" alt="Web Check Icon" />
          Intellium Check
        </Heading>
        <Input
          id="user-input"
          value={userInput}
          label="Enter a URL"
          size="large"
          orientation="vertical"
          placeholder={placeholder}
          handleChange={inputChange}
        />
        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
        <Button styles="width: calc(100% - 1rem);" size="large" onClick={submit}>
          Analyze!
        </Button>
      </UserInputMain>
      <Footer isFixed={true} />
    </HomeContainer>
  );
};

export default Home;
