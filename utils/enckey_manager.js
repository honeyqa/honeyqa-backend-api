'user strict';

// encrypt key manager ( 뼈대만 잡음 - 코딩을 위해서, 현종님이 완료 해주실 예정 )

// 아래 숫자 인댁스와 token id 를 둘다 설정 하는 이유는 랜덤으로 뽑아올때는 인덱스 순서로 뽑아오고, 
// token id 를 이용해서 가져올때도 같은 키를 가져올 수 있도록 하기 위함
var enc_table_use_idx = new Array();
var enc_table_use_tokenid = new Array();
var enc_count = 0;
var enc_idx = 0;
var add_enctable = function( token, basekey ){
	enc_table_use_idx[enc_count] = { token:token, basekey:basekey };
	enc_table_use_tokenid[token] = basekey; 
	enc_count = enc_count + 1;	
}
// 키 테이블 추가
add_enctable( "1#4bfc.703a", "61412605-1#4bfc-944c-491c-9ffd-703a-4452deb9e2b2" );
add_enctable( "2#4bfc.703a", "71412605-1#4bfc-944c-491c-9ffd-703a-4452deb9e2b2" );
add_enctable( "3#4bfc.703a", "81412605-1#4bfc-944c-491c-9ffd-703a-4452deb9e2b2" );
add_enctable( "4#4bfc.703a", "91412605-1#4bfc-944c-491c-9ffd-703a-4452deb9e2b2" );

/**
 * URL GetKey 에서 키 테이블에서 랜덤으로 하나를 선정하여 cb를 호출 해 주길 원함
 * 
 * cb = function( token, basekey ){};
 *	@param token 토큰  ID  -->  만약 null 이면 생성 애러임!!! 에러 리턴 해주기
 *  @param basekey 비밀키 
 *
 */
exports.get_key = function( cb ){

	var current_tableidx = enc_idx;

	// multi thread 고려 하지 않았음 
		// 다음 인덱스 설정
	enc_idx = enc_idx + 1;
	if( enc_idx >= enc_count ){
		enc_idx = 0;
	}

	var curr = enc_table_use_idx[ current_tableidx ];
	cb( curr.token, curr.basekey );

}

/**
 * 기본 동작은 get_key 와 거의 동일 하지만 token을 기준으로 읽어 오는 방식이다~~!!
 *
 * cb = function( iscontained, basekey ){};
 *		@param iscontained boolean  --> 존재하면 true, 아니면 false 
 *		@param basekey --> 그냥 basekey 만 전달 한다. basekey
 *
 */
exports.get_key_use_token = function( token, cb ){

	var basekey = enc_table_use_tokenid[ token ];
	cb( (null != basekey) , basekey );

}
