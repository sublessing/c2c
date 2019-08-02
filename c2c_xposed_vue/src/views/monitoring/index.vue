<template>
    <div class="app-container">
        <el-row style="margin-bottom: 10px;">
            <el-col :span="12">
                <merchant-pay></merchant-pay>
            </el-col>
            <el-col :span="12">
                <merchant-draw></merchant-draw>
            </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
            <el-col :span="12">
                <channel-pay></channel-pay>
            </el-col>
            <el-col :span="12">
                <channel-draw></channel-draw>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import merchantPay from './components/order_pay'
import merchantDraw from './components/alipay_pay'
import channelPay from './components/wx_pay'
import channelDraw from './components/union_pay'
export default {
    name: 'SystemMonitoring',
    components: {
        merchantPay,
        merchantDraw,
        channelPay,
        channelDraw
    }
}
</script>

<style>

</style>
