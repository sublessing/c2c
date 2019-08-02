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
import merchantPay from './components/pay_number'
import merchantDraw from './components/pay_money'
import channelPay from './components/pay_rate'
import channelDraw from './components/pay_balance'
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
