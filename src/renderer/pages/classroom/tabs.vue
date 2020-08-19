<template>
  <div class="class-tabs">
    <el-tabs v-model="activeName" @tab-click="clickTab" stretch>

      <el-tab-pane :label="lang.class.Courseware" name="Courseware">
        <course-ware
          :lang="lang">
        </course-ware>
      </el-tab-pane>

      <el-tab-pane :label="lang.class.Discuss" name="Discuss">
        <discuss
          :lang="lang">
        </discuss>
      </el-tab-pane>

      <el-tab-pane name="Student">
        <span slot="label">
          <img v-if="activeName === 'Student'" class="icon" src="@/assets/img/class/humen-checked.png" alt="">
          <img v-else class="icon" src="@/assets/img/class/humen.png" alt="">
           ({{users && users.length}})
        </span>
        <student
          :lang="lang"
          :students="users">
        </student>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import lang from '@/common/mixins/lang'
export default {
  props: {
    users: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      activeName: 'Courseware'
    }
  },
  mixins: [lang],
  components: {
    CourseWare: () => import('./com/courseWare'),
    Discuss: () => import('./com/discuss'),
    Student: () => import('./com/students')
  },
  methods: {
    clickTab () {}
  }
}
</script>

<style lang="less">
.class-tabs {
  height: 100%;
  background: #fff;
  .el-tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
    .el-tabs__header {
      margin-bottom: 0;
      .el-tabs__active-bar {
        height: 0;
        display: none!important;
      }
      .el-tabs__nav-wrap::after {
        height: 1px!important;
        background-color: #eee;
      }
      .el-tabs__item {
        color: rgb(153, 153, 153);
        font-size: 14px;
        height: 50px;
        line-height: 50px;
        padding: 0;
        &.is-active {
          color: #2E62FD;
          background: #F3F6FF;
        }
      }
    }
    .el-tabs__content {
      flex: 1;
      min-height: 0;
      padding-right: 7px;
      overflow-y: auto!important;
      &::-webkit-scrollbar {
        width: 11px;
        background: rgba(0, 0, 0, 0.1);
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.2);
      }
    }
    #pane-Discuss, #pane-Student {
      height: 100%;
    }
    #tab-Student {
      img.icon {
        height: 16px;
        width: 16px;
        vertical-align: middle;
      }
    }
  }
}
</style>
