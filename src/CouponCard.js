import React from 'react';
import {
  Card,
  // CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText,
} from 'material-ui/Card';

const results = {
  casetify: {
    title: '3 Hong Kong',
    subtitle: '3 香港',
    avatar: 'http://www.three.com/assets/images/three-logo.png',
    image: 'https://www.casetify.com/img/three-hk-iphone7/mobile/iphone7-phone-case.jpg',
    couponTitle: 'Customize your iPhone 7 case',
    couponSubtitle: '為獨一無二的您，帶來不一樣的個人化手機殼。',
    body: '全球免費付運\n\n不論您身處何地，我們都可以把心儀的手機殼為您送上。香港的付運時間更快至4-5個工作天！\n\n* iPhone 7 Plus 手機殼的預計發貨日期為二零一六年十月上旬\n\n請即到就近的3香港門市了解及體驗Casetify手機殼。優惠詳情請瀏覽www.three.com.hk',
  },
  kokuryu: {
    title: '黑龍',
    subtitle: '沖繩拉麵',
    avatar: 'http://blog.ulifestyle.com.hk/blogger/wddjaiii/wp-content/blogs.dir/0/4208/files/2014/12/IMG_2565.jpg',
    image: 'http://blog.ulifestyle.com.hk/blogger/wddjaiii/wp-content/blogs.dir/0/4208/files/2014/12/IMG_2571.jpg',
    couponTitle: '灣仔店',
    couponSubtitle: '惠顧任何拉麵送替玉一客',
    body: 'G/F 29 Swatow St, Wan Chai Hong Kong 2217 6883 Today 12:00PM - 2:30PM, 6:00PM - 10:00PM',
  },
};

const CouponCard = (prop) => (
  <Card>
    <CardHeader
      title={results[prop.result].title}
      subtitle={results[prop.result].subtitle}
      avatar={results[prop.result].avatar}
    />
    <CardMedia>
      <img alt="card-media" src={results[prop.result].image} />
    </CardMedia>
    <CardTitle title={results[prop.result].couponTitle} subtitle={results[prop.result].couponSubtitle} />
    <CardText>
      {results[prop.result].body}
    </CardText>
  </Card>
);

CouponCard.propTypes = {
  result: React.PropTypes.string,
};

CouponCard.defaultProps = {
  result: 'casetify',
};

export default CouponCard;
