<template>
  <div class="msg-item"
    :class="item.type ? item.type : ''">
    <div class="info" v-if="item.msg_type === 0">
      <span>{{item.type === 'teacher'
          ? `${lang.class.Myself}：(${item.nickname})`
          : item.nickname
          }}</span>
      <span>{{item.time}}</span>
    </div>
    <div class="message-info">
      <template v-if="item.msg_type === 0">
        {{item.message}}
      </template>
      <template v-else>
        <span>{{item.message}}</span>
        <span>{{item.time}}</span>
      </template>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    lang: Object
  }
}
</script>

<style lang="less" scoped>
.msg-item {
  padding: 10px 10px 5px;
  .info {
    display: flex;
    color: #666666;
    span {
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 4px;
      &:first-child {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 12px;
      }
      &:last-child {
        width: 50px;
        color: rgb(153, 153, 153);
      }
    }
  }
  .message-info {
    font-size: 16px;
    line-height: 22px;
    display: flex;
    justify-content: space-between;
    span {
      &:first-child {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &:last-child {
        font-size: 14px;
        width: 50px;
      }
    }
  }
  &.teacher {
    .info, .message-info {
      color: #FFB92C;
    }
  }
  &.me {
    .info, .message-info {
      color: #FFB92C;
    }
  }
  &.system {
    .info, .message-info {
      color: #999999;
    }
  }
}
</style>
