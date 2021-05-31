# 당근마켓 클론코딩 - 어플


![20210530_044014 (1)](https://user-images.githubusercontent.com/79817676/120127198-b9040d00-c1f9-11eb-8a99-8ad238d0be0c.png)


## 💡 당근마켓 클론코딩 소개
- 당근마켓 클론코딩을 진행
- 중고거래 페이지, 동네생활 페이지 완성
- 게시글 및 댓글 작성, 수정, 삭제가 가능한 커뮤니티 구현

## 📌 개요 
- 이름: 당근마켓 클론코딩
- 기간: 2021.04.02 ~ 2021.04.08
- 팀원
  - Front-end(React-Native): 김지하, 신일섭
  - Back-end(Node.js): 조상균, 이총명

## 🔌 개발 환경
- Server: AWS EC2(Ubuntu 20.04 LTS)
- Framework: Express(Node.js)
- Database: MongoDB

## 🔭 주요 라이브러리
 mongoose, jsonwebtoken, multer, sanitize-html, dotenv

## ✨ 주요 기능
#### 1. 로그인
- 아이디, 패스워드를 입력하여 로그인 할 수 있고 로그아웃 버튼을 눌러서 나올수 있습니다. (jwt 토큰)
#### 2. 회원가입
- 아이디, 비밀번호, 닉네임을 입력하고 회원가입을 진행할 수 있습니다.
#### 3. 동네 생활페이지 및 중고거래 페이지
- 다른사람의 글 목록을 확인하고 클릭해서 상세 내용을 확인할 수 있습니다.
#### 4. 글 작성, 수정, 삭제
- 로그인한 사용자는 글을 작성하여 게시할 수 있고 자신의 글만 수정 및 삭제가 가능합니다
#### 5. 댓글 작성, 수정, 삭제
- 로그인한 사용자는 댓글을 달 수 있고 다른 사람들의 댓글 리스트를 확인 가능합니다.



## DB 설계 
- 상세 페이지 : https://www.notion.so/_Clone_Introduction-9b0d01af52b14ee88bd1f5212b480bd7 <br>
![image](https://user-images.githubusercontent.com/79817676/120127375-30d23780-c1fa-11eb-894b-cfff8f62e06f.png)


## 주요 API



|기능|Method|URL| Request Params / Body, Response|
|:---|:---:|:---:|:---:|
|접속자 정보|GET|/user|userId, nickname, id, area|
|회원가입 요청|POST|/| msg : "empty" ||  "not_match" || "incorrect_id" || "incorrect_password" || "incorrect_nickname" "exist_user" || "error" || "success"|
|로그인 요청|POST|/auth| msg : "success" or "fail" |
|글 목록|GET|/exchange|posts:[{ exchangeId, nickname, title, price, contents, loveCount, area, beforeTime, soldState}]..|
|중고거래 글 정보|GET|/exchange|exchangeId, title, price, beforeTime , nickname, loveCount, area, contents , img:[이미지1,2...], soldState|
|판매상태 변경|PATCH|/exchange/:postId/state||
|글 등록 요청|POST|/exchange| |
|글 삭제 요청|DELETE|/exchange/:exchangeId| |
|글 수정 요청|PATCH|/exchange/:exchangeId| |
|글 목록|GET|/town?lastId=<마지막글ID>| status, boards: [{townId, nickname, area, contents, category, date, commentCount, images: [], userId },..... |
|글 등록 요청|POST|/town| |
|동네생활 글 정보|GET|/town/:townId| status, board: { townId, nickname, beforeTime, area, commentCount, contents, images: []} |
|글 삭제 요청|DELETE|/town:townId| |
|글 수정 요청|PATCH|/town:townId| |
|댓글 목록|GET|/comment/:townId|status, comments: [{ commentId, townId, commentContents, nickname, userId },... |
|댓글 추가|POST|/comment/:townId||  |
|댓글 삭제|DELETE|/comment/:commentId||  |
|프로필 확인|GET|/profile|{status, profileData :[{nickname, area, userid}] |
|이미지 업로드 요청|POST|/image|{status, images:["~","~"]}  |




## 힘들었던 점 및 개선 사항
#### 보안
- 크로스 사이트 스크립팅(XSS)은 웹 애플리케이션에서 많이 나타나는 취약점의 하나로 웹사이트관리자가 아닌 사용자가 웹페이지에 악성 스크립트를 삽입할 수 있는 취약점입니다. 그래서 sanitize-html라이브러리를 사용하여 데이터의 입력과 출력이 필요한 부분에 스크립트 방지 처리를 하여 보안적인 부분을 개선하였습니다.  


## 프로젝트 상세 설명 페이지
- https://www.notion.so/6-5e55dd586d67463f8d94a368d4ada8b4

## Front-End(React) 코드 
- https://github.com/kim-jiha95/carrot-market-Clone
