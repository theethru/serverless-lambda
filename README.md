THEETHRU Serverless-Lambda Framework
===

## 소개(Intro)
serverless 프레임워크를 기반으로 AWS람다에서 동작하는 RESTful API 서버 프레임워크.

#### Framework : Serverless

#### Routing : Express

#### Language : Typescript

---

## 설정(Configuration)
설정 파일은 **src/configs** 디렉토리에 위치합니다.
local(로컬), dev(개발서버), prod(운영) 환경별로 설정이 가능합니다.

#### **app.config.js**
> APP 관련 설정   
    **URL** : 앱에서 사용될 URL관련 설정   


#### **aws.config.js**
> AWS 관련 설정   
    **LAMBDA** : 람다 관련 설정   
    **DOMAIN** : 도메인 관련 설정(API에 등록된 값으로 도메인 생성 및 배포)   
    **S3** : S3 관련 설정   


#### **credential.config.js**
> 인증관련 설정   
    **APP** : 앱에서 사용될 설정(HASH_SALT, JWT_PRIVATE_KEY 에 등록된 값은 반드시 변경해주세요)   
    **AWS** : AWS에 사용될 설정   
    **DB** : DB에 사용될 설정   

---

## 테스트 환경 구축 및 실행

#### 기본 설치
> node

> npm 

> serverless



#### DB
> 테스트용 DB덤프 파일
> /dump/db/theethru.sql

#### API
> POST man 컬렉션 파일
> /dump/postman/collection.json

#### 로컬 서버 실행
    $ ./serve.sh

실행 서버의 포트 변경이 필요할 경우 serve.sh 의 --port 옵션을 변경해주세요.

#### 준비된 API

> **공통 코드 요청**
> GET : /app/code 

> **회원 가입**
> POST : /auth/signup
> 
> **로그인**
> POST : /auth/login
> 
> **액세스 토큰 체크**
> POST : /auth/check-access-token
> 
> **액세스 토큰 갱신**
> POST : /auth/refresh-access-token
> 
> **탈퇴**
> POST : /auth/secession

> **내 정보 요청**
> GET : /my/info
> 
> **내 정보 수정**
> PUT : /my/info
> 
> **비밀번호 수정**
> PATCH : /my/password

> **이미지 업로드 요청**
> POST : /image
> *본 API호출 후 응답에 포함된 uploadUrl을 이용하여 실제 S3에 파일을 업로드

---

## 도메인 생성
    $ sls create_domain

*aws.config.js 파일의 DOMAIN.{env}.API 에 도메인 지정 필요
*위에 지정한 도메인이 AWS에 등록되어있고 ACM를 통한 인증서 등록도 필요

---

## 배포
    $ sls deploy
    -인자가 없을경우 개발환경(dev)에 배포
    -운영 배포가 필요할경우 인자로 prod 추가

--- 

## 주요 파일
#### **src/data/user.data.ts**   
> 접속한 사용자의 헤더 정보와 로그인 정보   

#### **src/db/manager.db.ts**   
> DB의 접속 및 관리   

#### **src/definitions/table.definition.ts**   
> DB 테이블 정보   

#### **src/exceptions/common.exception.ts**   
> 예외처리 관련 로직   

#### **src/helpers/*.helper.ts**   
> 헬퍼 파일   

#### **src/interfaces/express.interface.ts**   
> Express용 Request, Response, NextFunction 인터페이스 재 정의   

#### **src/loggers/common.logger.ts**   
> 로거   

#### **src/models/*.model.ts**   
> DB 관련 로직   

#### **src/services/*.service.ts**   
> Service 관련 로직   

#### **src/routers/*.router.ts**   
> Router 파일   

#### **src/app.ts**   
> Lambda 서비스의 엔트리 포인트 핸들러   
