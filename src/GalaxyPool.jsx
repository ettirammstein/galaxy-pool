// GALAXY POOL — testnet фронт

import styled from 'styled-components';
import { useState } from 'react';

const accountId = context.accountId;
const GACHA_CONTRACT = "galaxy-pool.babloweb4.testnet";

// Профиль тянем только если есть логин
const profile = accountId ? Social.getr(`${accountId}/profile`) : null;

// Инициализация состояния
State.init({
  showResult: false,
  lastWin: 0,
  orbitSlot: 10, // минуты по умолчанию: 1 / 10 / 100 / 1000
});

// Получаем статус пула: [баланс токена, количество игроков]
const poolStatus = Near.view(GACHA_CONTRACT, "get_status") || ["0", 0];

// Проверка доступа/орбиты
const hasAccess = accountId
  ? Near.view(GACHA_CONTRACT, "has_access", { account_id: accountId })
  : false;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: radial-gradient(circle at top, #020617 0%, #000 60%);
  color: #fff;
  font-family: 'Courier New', monospace;
  padding: 20px;
  position: relative;
`;

const UserBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(15, 23, 42, 0.8);
  padding: 8px 15px;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.4);
`;

return (
  <Wrapper>
    {/* ВЕРХНЯЯ ПАНЕЛЬ С ЮЗЕРОМ */}
    {accountId && (
      <UserBadge>
        <span>{profile?.name || accountId}</span>
        <Widget
          src="mob.near/widget/ProfileImage"
          props={{
            accountId,
            style: { width: "30px", height: "30px", borderRadius: "50%" },
          }}
        />
      </UserBadge>
    )}

    <h1>// GALAXY_POOL_v2 (testnet)</h1>
    <p style={{ opacity: 0.6 }}>Total Players: {poolStatus[1]}</p>

    {/* КАПЛЯ / ГАЛАКТИКА */}
    <Widget
      src="babloweb4.testnet/widget/LiquidDropVisual" // сделаешь такой виджет отдельно
      props={{
        active: hasAccess,
        poolBalance: poolStatus[0],
        orbitSlot: state.orbitSlot,
      }}
    />

    {/* ВЫБОР ОРБИТЫ */}
    <div style={{ marginTop: "30px", display: "flex", gap: "8px" }}>
      {[1, 10, 100, 1000].map((m) => (
        <button
          key={m}
          onClick={() => State.update({ orbitSlot: m })}
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid #22d3ee",
            background: state.orbitSlot === m ? "#22d3ee" : "transparent",
            color: state.orbitSlot === m ? "#000" : "#22d3ee",
            fontSize: 12,
          }}
        >
          {m} min
        </button>
      ))}
    </div>

    <div style={{ marginTop: "40px", textAlign: "center" }}>
      {!accountId ? (
        <Widget
          src="near/widget/DIG.Button"
          props={{ label: "Connect Wallet", onClick: () => {} }}
        />
      ) : (
        <>
          {hasAccess ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <p style={{ opacity: 0.8 }}>Ты уже в пуле! Жди следующий спин.</p>
            </div>
          ) : (
            <button
              onClick={() => Near.call(GACHA_CONTRACT, "join_pool", {}, "1000000000000000000000000")}
              style={{
                padding: "15px 30px",
                borderRadius: "20px",
                border: "none",
                background: "#fff",
                color: "#000",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ВСТУПИТЬ В ПУЛ (1 NEAR)
            </button>
          )}
        </>
      )}
    </div>
  </Wrapper>
);
                gap: "10px",
                alignItems: "center",
              }}
            >
              <Widget
                src="near/widget/DIG.Button"
                props={{
                  label: "YOU ARE IN ORBIT",
                  variant: "confirm",
                  onClick: () => {},
                }}
              />
              <p style={{ color: "#16cc9e", fontSize: 12 }}>
                ✓ You will receive drops while this orbit spins
              </p>
            </div>
          ) : (
            <Widget
              src="near/widget/DIG.Button"
              props={{
                label: `JOIN ORBIT (${state.orbitSlot} min, 0.1 NEAR)`,
                onClick: () => {
                  Near.call(
                    GACHA_CONTRACT,
                    "join_and_spin",
                    { slot_minutes: state.orbitSlot }, // добавь этот арг в Rust
                    "300000000000000", // газ
                    "100000000000000000000000" // 0.1 NEAR
                  );

                  Social.set({
                    post: {
                      main: `I just joined the GALAXY POOL orbit for ${state.orbitSlot} minutes 🚀`,
                    },
                    index: {
                      post: JSON.stringify({
                        key: "main",
                        value: { type: "md" },
                      }),
                    },
                  });
                },
              }}
            />
          )}
        </>
      )}
    </div>

    {/* ФУТЕР С АКТИВНОСТЬЮ */}
    <div style={{ marginTop: "50px", width: "100%", maxWidth: "400px" }}>
      <p style={{ fontSize: "10px", textAlign: "center" }}>RECENT ACTIVITY</p>
      <Widget src="mob.near/widget/LastWidgets" />
    </div>
  </Wrapper>
);