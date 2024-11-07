# javascript-convenience-store-precourse

## ✅ 프로그램 흐름

- 상품 목록 안내하기
- 구매할 상품명과 수량을 입력 받기
- 프로모션 제품일 경우 프로모션 관련 사항 물어보기
- 멤버심 할인 관련 사항 물어보기
- 영수증 출력하기
- 결제된 수량만큼 해당 상품의 재고에서 차감하기
- 추가 구매 여부 확인하기

## ✅ 기능 목록

### 상품 목록 저장 및 안내

- [x] products.md 파일 읽기
- [x] 파일에서 이름, 가격, 수량, 프로모션 이름을 파싱하기
- [x] 유일한 상품 리스트 저장하기
- [x] 파싱한 상품의 이름과 가격을 각각 저장하기
- [x] 프로모션인 상품을 담는 박스와 일반 상품을 담는 박스 구별하기
- [x] 상품 목록 출력하기

### 프로모션 내용 저장

- [x] promotions.md 파일 읽기
- [x] 파일에서 이름, buy, get, 시작 날짜, 종료 날짜 파싱하기
- [x] 파싱한 프로모션 데이터 저장하기

### 구매할 상품명과 수량을 입력 받기

- [ ] 구매할 상품과 수량을 입력 받기
- [ ] 구매할 상품과 수량 형식 맞는지 확인 ([콜라-10] 이와 같은 형식인가)

### 재고 관리

- [ ] 각 상품의 재고 수량을 고려하여 결제 가능 여부 확인하기
- [ ] 고객이 구매 후 결제된 수량만큼 상품 재고 차감

### 프로모션 할인

- [ ] 프로모션 기간 확인하기
- [ ] 프로모션을 적용한 수량만큼 재고가 있는가 확인하기
  - [ ] 없을 경우 : 프로모션이 적용되지 않음을 알리기
- [ ] 프로모션 수만큼 가져왔는가 확인하기
  - [ ] 가져오지 않은 경우 : 추가하시겠는지 물어보기
- [ ] 프로모션 할인 적용하기

### 멤버십 할인

- [ ] 프로모션 아닌 상품을 더한 금액 구하기
- [ ] 프로모션 제외한 금액의 30%만큼 할인 금액 계산하기
- [ ] 할인 금액이 8000원 넘을 시 최대 8000원 할인하기

### 결제 금액 계산

- [ ] 상품별 가격과 수량을 곱하여 총구매액 계산하기
- [ ] 행사 할인 금액 계산하기 (프로모션에 의해 할인된 금액)
- [ ] 멤버십 할인 금액 계산하기 (멤버십에 의해 할인된 금액)
- [ ] 최종 결제 금액 계산하기

### 입력

- [ ] 구매할 상품과 수량 입력 받기
- [ ] 프로모션 제품일 경우 프로모션 관련 사항에 대한 응답 입력 받기
- [ ] 멤버십 할인 적용 여부를 입력 받기
- [ ] 추가 구매를 진행 여부 입력 받기

### 출력

- [ ] 환영 인사 출력
- [ ] 상품명, 가격, 프로모션 이름, 재고 안내 내용 출력
- [ ] 영수증 출력
- [ ] 에러 출력

### 에러 상황

- [ ] 구매할 상품과 수량 형식이 올바르지 않은 경우
- [ ] 존재하지 않는 상품을 입력한 경우
- [ ] 구매 수량이 재고 수량을 초과한 경우
- [ ] (Y/N)에 대한 질문에 바르게 응답하지 않은 경우
- [ ] products.md나 promotions.md를 읽오지 못한 경우 에러 후 종료
