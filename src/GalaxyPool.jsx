import styled from 'styled-components';
import { useState } from 'react';

const GACHA_CONTRACT = "babloweb4.near";
const { accountId } = context;

// Styled Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  background: linear-gradient(135deg, #000 0%, #1a1a2e 100%);
  color: #fff;
  padding: 20px;
`;

const Title = styled.h1`
  color: #06b6d4;
  font-size: 3rem;
  text-shadow: 0 0 20px #06b6d4;
  margin-bottom: 40px;
  letter-spacing: 2px;
`;

const GalaxyCircle = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #06b6d4, #0d5f6f);
  box-shadow: 0 0 60px #06b6d4, inset 0 0 30px rgba(6, 182, 212, 0.3);
  margin: 30px 0;
  animation: ${props => props.isSpinning ? 'spin 1s linear infinite' : 'none'};

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const SpinButton = styled.button`
  margin-top: 40px;
  padding: 15px 40px;
  border-radius: 25px;
  border: 2px solid #06b6d4;
  background: ${props => props.isLoading ? '#06b6d4' : '#fff'};
  color: ${props => props.isLoading ? '#fff' : '#000'};
  font-size: 1.1rem;
  font-weight: bold;
  cursor: ${props => props.isLoading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover:not(:disabled) {
    background: #06b6d4;
    color: #000;
    box-shadow: 0 0 30px #06b6d4;
  }

  &:disabled {
    opacity: 0.7;
  }
`;

const Message = styled.div`
  margin-top: 30px;
  padding: 15px 25px;
  border-radius: 10px;
  background: ${props => props.type === 'error' ? '#ef4444' : '#10b981'};
  color: #fff;
  text-align: center;
  min-width: 300px;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AuthMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #06b6d4;
  padding: 20px;
`;

export default function GalaxyPool() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Проверка авторизации
  if (!accountId) {
    return (
      <Wrapper>
        <Title>GALAXY POOL</Title>
        <GalaxyCircle />
        <AuthMessage>
          ⚠️ Пожалуйста, авторизуйтесь для участия в розыгрыше
        </AuthMessage>
      </Wrapper>
    );
  }

  const spin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Вызов смарт-контракта
      const result = await Near.call(
        GACHA_CONTRACT,
        "request_spin",
        {},
        "300000000000000"
      );

      setMessage({
        type: 'success',
        text: `🎉 Спин выполнен! Результат: ${result ? JSON.stringify(result) : 'обработан'}`
      });
    } catch (error) {
      console.error('Ошибка при вызове контракта:', error);
      setMessage({
        type: 'error',
        text: `❌ Ошибка: ${error.message || 'Не удалось выполнить спин'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>GALAXY POOL</Title>
      <GalaxyCircle isSpinning={isLoading} />
      
      <SpinButton 
        onClick={spin} 
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? '⏳ КРУТИТСЯ...' : '🎰 БАБЛО'}
      </SpinButton>

      {message && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}

      <div style={{ marginTop: '40px', fontSize: '0.9rem', opacity: '0.7' }}>
        Аккаунт: <strong>{accountId}</strong>
      </div>
    </Wrapper>
  );
}
