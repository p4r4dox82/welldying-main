import { directive } from '@babel/types';
import React from 'react';
import { match } from 'react-router';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { imageUrl } from '../etc/config';


interface MatchParams {
    id?: string;
};

interface Props {
    match: match<MatchParams>;
};
let productInformationNavigationMenuArray = ["상품정보", "리뷰", "문의", "배송/환불"];
export interface productInformation {
    subtitle: string;
    title: string;
    price: number;
    imageUri: string;
}
export let productInformationArray : productInformation[] = [
    {
        subtitle: "함께 그리는 삶의 마침표",
        title: "웰다잉 대화 카드 [함께, 기억]",
        price: 12900,
        imageUri: imageUrl("SellingPage/Product1"),
    },
    {
        subtitle: "당신의 아름다운 순간을 한 권의 책에 담다",
        title: "청춘유언 프로그램",
        price: 20000,
        imageUri: imageUrl("SellingPage/Product2"),
    },
    
]

function ProductPage({ match }: Props) {
    let id = Number.parseInt(match.params.id || '1');
    let productInformation = React.useMemo(() => productInformationArray[id - 1], [id, productInformationArray]);
    let [product, setProduct] = React.useState<any>();
    let [productInformationNavigationMenu, setProductInformationNavigationMenu] = React.useState<number>(0);
    let setProductBySelect = (e: any) => {
        setProduct(e.target.value);
    }
    let defaultProduct = "상품을 선택해주세요.";
    let productName = "웰다잉 대화카드 [함께, 기억]";
    React.useEffect(() => window.scrollTo(0, 0), []);
    React.useEffect(() => setProduct(productInformation.title), [productInformation]);
    return (
        <>
            <div className="productPage">
                <Header additionalClass = ""></Header>
                <Link to = '/sellmain'><button className="goSellMain">{"메멘토 굿즈 >"}</button></Link>
                <div className="productMainBlock">
                    <div className="imageContainer">
                        <img src={productInformation.imageUri + "/productThumbnail.png"} alt="" className="mainImage" />
                        <div className="imageList">
                            <img src={productInformation.imageUri + "/productThumbnail.png"} alt="" className="imageListElement" />
                        </div>
                    </div>
                    <div className="informationContainer">
                        <div className="subtitle">{productInformation.subtitle}</div>
                        <div className="title">{productInformation.title}</div>
                        <div className="price">{productInformation.price}  <span>원</span></div>
                        <div className="deliver">
                            <div className="name">배송</div>
                            <div className="detail">택배 배송/무료 배송</div>
                        </div>
                        <select name="" id="" className="product" onChange = {setProductBySelect}>
                            <option value={productInformation.title} key = {productInformation.title}>{productInformation.title}</option>
                            <option value={defaultProduct} key = {defaultProduct}>{defaultProduct}</option>
                        </select>
                        <div className="totalPrice">
                            <div className="name">주문금액</div>
                            <div className="price">{productInformation.price}원</div>
                        </div>
                        <div className="buttonContainer">
                            <button className="addCart">장바구니 담기</button>
                            <Link to ={`/payment/${id}`}><button className="purchase" onClick = {() => console.log(product)}>바로구매</button></Link>
                        </div>
                    </div>
                </div>
                <div className="productInformationNavigation">
                    <div className="navigationMenu">
                        {productInformationNavigationMenuArray.map((menuName, key) => {
                            return (
                                <div className="navigationMenuElement" onClick = {() => setProductInformationNavigationMenu(key)}>
                                    <div className="name">{menuName}</div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="selectorVector" style = {{transform: `translateX(${(140 * productInformationNavigationMenu) + 'px'})`}}></div>
                </div>
                {productInformationNavigationMenu === 0 && <div className="productInformationBlock">
                    <div className="productInformationTable">
                        <div className="tableRow">
                            <div className="name">상품상태</div>
                            <div className="detail">새상품</div>
                            <div className="name">상품번호</div>
                            <div className="detail">5539041140</div>
                        </div>
                        <div className="tableRow">
                            <div className="name">배송방법</div>
                            <div className="detail">택배</div>
                            <div className="name">영수증 발급</div>
                            <div className="detail">신용카드전표, 현금영수증발급</div>
                        </div>
                        <div className="tableRow">
                            <div className="name">원산지</div>
                            <div className="detail">국산(서울특별시 관악구)</div>
                            <div className="name"></div>
                            <div className="detail"></div>
                        </div>
                        <div className="tableRow">
                            <div className="name">브랜드</div>
                            <div className="detail">자체제작 상품</div>
                            <div className="name"></div>
                            <div className="detail"></div>
                        </div>
                        <div className="tableRow">
                            <div className="name">A/S안내</div>
                            <div className="detail">0507-1367-0842</div>
                            <div className="name"></div>
                            <div className="detail"></div>
                        </div>
                        <div className="tableRow">
                            <div className="name">배송가능지역</div>
                            <div className="detail">전국</div>
                            <div className="name"></div>
                            <div className="detail"></div>
                        </div>
                    </div>
                    <div className="imageContainer">
                        <img src={productInformation.imageUri + "/productInformationImage.png"} alt="" className="productInformationImage" />
                    </div>
                    <div className="divider" style = {{marginTop: '157px'}}>
                        <div className="crossLine"></div>
                        <div className="circle"></div>
                    </div>
                    <div className="notificationContainer">
                        <div className="title">기타 문의 사항</div>
                        <div className="notificationList">
                            <div>문의사항은 하단의 문의사항 게시판에 작성해주세요.</div>
                            <div>문의 시 구매자명과 선택하신 옵션 기재 후 문의내용을 작성해주세요.</div>
                            <div>결제 후 배송지 오류에 대해서는 판매자가 책임지지 않습니다. 파손 또는 불량품 수령 시 5일 이내로 교환이 가능합니다.</div>
                            <div>교환 및 AS문의는 하단의 문의하기 버튼을 이용해주세요. 파손, 불량품 교환 시 발생하는 비용은 판매자가 부담합니다.</div>
                            <div>선물 확인을 위한 포장 훼손 외에 아이템의 가치가 훼손된 경우에는 교환 및 환불이 불가합니다.</div>
                        </div>
                    </div>
                    <div className="divider" style = {{marginTop: '119px'}}>
                        <div className="crossLine"></div>
                        <div className="circle"></div>
                    </div>
                    <div className="productDetailInformationBlock">
                        <div className="title">상품정보 제공고시</div>
                        <div className="productDetailInformationTable">
                            <div className="tableRow">
                                <div className="name">도서명</div>
                                <div className="detail">상품상세참조</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">저자/출판사</div>
                                <div className="detail">상품상세참조/상품상세참조</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">크기</div>
                                <div className="detail">상품상세참조</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">쪽수</div>
                                <div className="detail">상품상세참조</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">제품구성</div>
                                <div className="detail">해당사항 없음</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">출간일</div>
                                <div className="detail">상품상세참조</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">목차 또는 책 소개</div>
                                <div className="detail">상품상세참조</div>
                            </div>
                        </div>
                    </div>
                    <div className="transactionInformationBlock">
                        <div className="title">거래 조건에 관한 정보</div>
                        <div className="transactionInformationTable">
                            <div className="tableRow">
                                <div className="name">재화등의 배송방법에 관한 정보</div>
                                <div className="detail">택배</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">주문 이후 예상되는 배송기간</div>
                                <div className="detail">대금 지급일로부터 3일 이내에 배송</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">제품하자·오배송 등에 따른 청약철회 등의 경우
청약철회 등을 할 수 있는 기간 및 통신판매업자가
부담하는 반품비용 등에 관한 정보</div>
                                <div className="detail">전자상거래등에서의소비자보호에관한법률 등에 의한 제품의 하자 또는 오배송 등으로 인한 청약철회의 경우에는
상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할 수 있으며,
반품 비용은 통신판매업자가 부담합니다.</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">제품하자가 아닌 소비자의 단순변심, 착오구매에 따른
청약철회 시 소비자가 부담하는 반품비용 등에 관한 정보</div>
                                <div className="detail">무료</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">제품하자가 아닌 소비자의 단순변심, 착오구매에 따른
청약철회가 불가능한 경우 그 구체적 사유와 근거</div>
                                <div className="detail">전자상거래등에서의소비자보호에관한법률 등에 의한 청약철회 제한 사유에 해당하는 경우 및 기타 객관적으로
이에 준하는 것으로 인정되는 경우 청약철회가 제한될 수 있습니다.</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">재화등의 교환·반품·보증 조건 및 품질보증기준</div>
                                <div className="detail">소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">재화등의 A/S 관련 전화번호</div>
                                <div className="detail">01040500842</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">대금을 환불받기 위한 방법과 환불이 지연될 경우 지연에
따른 배상금을 지급받을 수 있다는 사실 및 배상금 지급의
구체적 조건 및 절차</div>
                                <div className="detail">주문취소 및 대금의 환불은 네이버 페이 마이페이지에서 신청할 수 있으며, 전자상거래 등에서의 소비자보호에
관한 법률에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을
정당한 사유 없이 지연하는 때에는 소비자는 지연기간에 대해서 연 15%의 지연배상금을 판매자에게 청구할 수 있습니다.</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">소비자피해보상의 처리, 재화등에 대한 불만 처리 및
소비자와 사업자 사이의 분쟁처리에 관한 사항</div>
                                <div className="detail">소비자분쟁해결기준(공정거래위원회 고시) 및 관계법령에 따릅니다.</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">거래에 관한 약관의 내용 또는 확인할 수 있는 방법</div>
                                <div className="detail">상품상세 페이지 및 페이지 하단의 이용약관 링크를 통해 확인할 수 있습니다.
</div>
                            </div>
                        </div>
                    </div>
                    <div className="mementoLicense">
                        <img src={imageUrl('SellingPage/backgroundImage.png')} alt="" className="backgroundImage" />
                        <div className="title">LICENSED BY MEMENTO</div>
                        <div className="detail">
                            <div>본 제품은 메멘토에서 제작 및 판매하는 것으로</div>
                            <div>무단 복제 및 판매를 금합니다.</div>
                        </div>
                    </div>
                </div>}
                {productInformationNavigationMenu === 3 && <div className="returnExchangeInformationBlock">
                    <div className="tableBlock returnExchangeInformation">
                        <div className="title">반품/교환 정보</div>
                        <div className="subtitle">*반품 시 먼저 판매자와 연락하셔서 반품사유, 택배사, 배송비, 반품지 주소 등을 협의하신 후 반품상품을 발송해 주시기 바랍니다.</div>
                        <div className="table">
                            <div className="tableRow">
                                <div className="name">판매자 지정 택배사</div>
                                <div className="detail">우체국 택배</div>
                            </div>
                            <div className="tableRow two">
                                <div className="name">반품 배송비</div>
                                <div className="detail">무료</div>
                                <div className="name">교환 배송비</div>
                                <div className="detail">5,000원</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">반품/교환지 주소</div>
                                <div className="detail">서울특별시 관악구 봉천동 856-6 BS타워 2층 (우) 08788</div>
                            </div>
                        </div>
                    </div>
                    <div className="textBlock returnExchangeStandard">
                        <div className="title">반품/교환 기준</div>
                        <div className="textContainer">
                            <div>구매자 단순 변심으로 인한 반품은 상품 수령 후 7일 이내에 신청하실 수 있습니다.(구매자 반품 배송비 부담) </div>
                            <div>단, 제품이 표시광고 내용과 다르거나 불량 등 계약과 다르게 이행된 경우는 제품 수령일부터 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일이내에 교환/반품이 가능합니다. </div>
                            <div>(판매자 반품 배송비 부담)</div>
                            <div>둘 중 하나 경과 시 반품/교환이 불가합니다.</div>

                            <div style = {{marginTop: '25px'}}>추가적으로 다음의 경우 해당하는 반품/교환은 신청이 불가능할 수 있습니다.</div>
                            <div className = "dot">반품요청기간이 지난 경우</div>
                            <div className = "dot">소비자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우 (단, 상품 확인을 위한 포장 훼손 제외)</div>
                            <div className = "dot">소비자의 책임있는 사유로 포장이 훼손되어 상품 가치가 현저히 상실된 경우 (예: 식품, 화장품, 향수류, 음반 등)</div>
                            <div className = "dot">소비자의 사용 또는 소비에 의해 상품 등의 가치가 현저히 감소한 경우 (라벨이 떨어진 의류, 또는 태그가 떨어진 명품관 </div>상품인 경우)
                            <div className = "dot">시간의 경과에 의해 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우</div>
                            <div className = "dot">복제가 가능한 상품 등의 포장을 훼손한 경우(CD/DVD/GAME/도서의 경우 포장 개봉 시)</div>
                            <div className = "dot">소비자의 주문에 따라 개별적으로 생산되는 상품이 제작에 들어간 경우</div>
                        </div>
                    </div>
                    <div className="tableBlock SellerInformation">
                        <div className="title">판매자 정보</div>
                        <div className="table">
                            <div className="tableRow two">
                                <div className="name">판매자</div>
                                <div className="detail">메멘토</div>
                                <div className="name">상호명/대표자</div>
                                <div className="detail">메멘토/신동경</div>
                            </div>
                            <div className="tableRow two">
                                <div className="name">사업자구분</div>
                                <div className="detail">개인사업자</div>
                                <div className="name">통신판매업신고</div>
                                <div className="detail">2021-서울관악-2054</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">사업자등록번호</div>
                                <div className="detail">176-64-00459</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">이메일</div>
                                <div className="detail">memento.welldying@gmail.com</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">영업소재지</div>
                                <div className="detail">(08788)  서울특별시 관악구 관악로158 (BS TOWER) 3층 스프링 캠프</div>
                            </div>
                            <div className="tableRow">
                                <div className="name">고객문의 대표번호</div>
                                <div className="detail">0507-1367-0842</div>
                            </div>
                        </div>
                    </div>
                    <div className="textBlock purchaseNotification">
                        <div className="title">구매시 주의 사항</div>
                        <div className="textContainer">
                            <div className = "dot">「전자상거래 등에서의 소비자보호에 관한 법률」에 의한 반품규정이 판매자가 지정한 반품조건보다 우선합니다.</div>
                            <div className = "dot">미성년자가 물품을 구매하는 경우, 법정대리인이 동의하지 않으면 미성년자 본인 또는 법정대리인이 구매를 취소할 수 있습니다.</div>
                            <div className = "dot">공산품, 전기용품 등 인증대상 상품을 구매하실 경우 '전기용품 및 생활용품 안전관리법' 등 관련 법률에 따라 허가 받은 상품인지 확인하시기 바랍니다.</div>
                        </div>
                    </div>
                </div>}

                {(productInformationNavigationMenu === 1 || productInformationNavigationMenu === 2) && <div className="returnExchangeInformationBlock" style = {{minHeight: '500px'}}>
                </div>}
                <Footer additionalClass = ""></Footer>
            </div>
        </>
    )
}

export default ProductPage;