<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

</style>
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :spam="24" class="warp-breadcrum">
      <div class="block" >
        <el-carousel height="300px">
          <el-carousel-item>
            <img src="../assets/images/b0.jpg" class="image">
          </el-carousel-item>
          <el-carousel-item>
            <img src="../assets/images/b1.jpg" class="image">
          </el-carousel-item>
          <el-carousel-item>
            <img src="../assets/images/b2.jpg" class="image">
          </el-carousel-item>
        </el-carousel>
        <br>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>通知公告</span>
            <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
          </div>
            <el-collapse v-model="activeNames" accordion>
              <el-collapse-item title="关于做好2018年下半年（第52次）全国计算机等级考试报名工作的通知" name="1">
                <div>根据湖南省教育考试院《关于做好2018年下半年全国计算机等级考试报名工作的通知》（湘教考通〔2018〕20号）精神，为做好我校考点第52次全国计算机等级考试（NCRE）报名工作，现将有关事项通知如下：</div>
                <div>1．开考科目及相关规定见报名网站：http://shekao.hneao.cn/ncre/</div>
                <div>2．考试时间为2018年9月15日、16日。</div>
                <div>3．机试考试环境：所有级别科目考试均为WIN 7环境下的无纸化机试。</div>
              </el-collapse-item>
              <el-collapse-item title="关于做好2018年本科生修读辅修专业及辅修专业学士学位工作的通知" name="2">
                <div>根据《关于做好2018年本科生修读辅修专业及辅修专业学士学位工作的通知》要求，首次报名结束后，如部分专业因报名人数少于最低开班人数而停开而没被录取的，这部分学生可进行二次选报，二次选报时间为2018年6月6日。根据首次报名人数统计结果，最终确定开班的辅修专业及辅修专业学士学士如下，请首次报名不成功的学生在规定的时间内进行二次选报：</div>
              </el-collapse-item>
              <el-collapse-item title="关于赴南京师范大学交流学习入选学生名单公示" name="3">
                <div> 根据我校与南京师范大学所签协议，2018年秋季学期计划派出10名本科学生前往南京师范大学相应专业进行学习。经学生自愿报名，教务处与交流学校审核，最终确定以下10名学生，现将名单予以公示。如有异议，请在6月8日（星期五）17:30前反映至教务处，逾期不予受理。</div>
                <div>联系人：杨老师；联系电话：0731-88872119</div>
              </el-collapse-item>
              <el-collapse-item title="关于做好2018年本科生修读辅修专业及辅修专业学士学位工作的通知" name="4">
                <div>根据《湖南师范大学本科生辅修专业及辅修专业学士学位教育管理暂行办法》（校行发教务字〔2016〕74号）文件精神，以及各学院申报开办辅修专业及辅修专业学士学位情况，学校决定，2018年面向2016、2017级本科学生开设部分辅修专业及辅修学位。</div>
              </el-collapse-item>
            </el-collapse>
        </el-card>
      </div>
    </el-col>

  </el-row>
</template>
<style>
  .time {
    font-size: 13px;
    color: #999;
  }
  .warp-breadcrum{
    min-width: 900px;
    max-width: 900px;

  }

  .image {
    width: 100%;
    display: block;
  }
</style>

<script>

  export default {
    data() {
      return {
        activeNames:''
      };
    },

  }
</script>
