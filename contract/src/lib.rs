use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, AccountId, env, PanicOnDefault, Promise, json_types::U128, PromiseOrValue};
use near_contract_standards::fungible_token::receiver::FungibleTokenReceiver;
use near_contract_standards::fungible_token::ext_fungible_token;
use std::collections::HashSet;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct GalaxyPool {
    pub owner_id: AccountId,
    pub pool_token_balance: u128,
    pub claimed_users: HashSet<AccountId>,
    pub total_claims: u64,
    pub last_distribution_time: u64,
    pub milestones: Vec<u64>,
}

#[near_bindgen]
impl GalaxyPool {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        Self {
            owner_id,
            pool_token_balance: 0,
            claimed_users: HashSet::new(),
            total_claims: 0,
            last_distribution_time: env::block_timestamp(),
            milestones: Vec::new(),
        }
    }

    // Метод для депозита токенов в пул (только админ может инициировать, но депозит через ft_transfer)
    pub fn deposit_pool(&mut self) {
        assert_eq!(env::predecessor_account_id(), self.owner_id, "Only owner can call deposit_pool");
        // Депозит происходит через ft_on_transfer, этот метод может быть для логики, например, обновления времени
        self.last_distribution_time = env::block_timestamp();
    }

    // Claim drop для пользователей
    pub fn claim_drop(&mut self) -> Promise {
        let user = env::predecessor_account_id();
        assert!(!self.claimed_users.contains(&user), "Already claimed");

        // Фиксированный amount на claim: 1 токен (предполагая 24 decimals)
        let claim_amount = 1_000_000_000_000_000_000_000_000u128;
        assert!(self.pool_token_balance >= claim_amount, "Not enough tokens in pool");

        self.claimed_users.insert(user.clone());
        self.total_claims += 1;
        self.pool_token_balance -= claim_amount;

        // Безопасный ft_transfer
        let token_contract: AccountId = "babloweb4.launch.intear.near".parse().unwrap();
        ext_fungible_token::ext(token_contract)
            .with_attached_deposit(near_sdk::NearToken::from_yoctonear(1)) // Для storage deposit
            .ft_transfer(user, U128(claim_amount), None)
    }

    // Получить статус пула
    pub fn get_pool_status(&self) -> (AccountId, U128, u64, u64, u64, Vec<u64>) {
        (
            self.owner_id.clone(),
            U128(self.pool_token_balance),
            self.claimed_users.len() as u64,
            self.total_claims,
            self.last_distribution_time,
            self.milestones.clone(),
        )
    }
}

impl FungibleTokenReceiver for GalaxyPool {
    fn ft_on_transfer(&mut self, sender_id: AccountId, amount: U128, _msg: String) -> PromiseOrValue<U128> {
        // Только owner может депозитить токены
        assert_eq!(sender_id, self.owner_id, "Only owner can deposit tokens");
        self.pool_token_balance += amount.0;
        self.last_distribution_time = env::block_timestamp();
        PromiseOrValue::Value(U128(0)) // Принять все токены
    }
}
