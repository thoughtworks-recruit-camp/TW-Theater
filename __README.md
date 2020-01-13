# 练习：思沃影院

## 练习目标

- 团队协作能力
- 代码规范
- Git协作开发

## 练习要求

#### 总体规则

- 团队维护一个代码库，可以独立开发也可以pair形式。

#### 界面规范

- 教练给学员提供产品原型以便沟通需求
- 原型中的功能必须实现，但具体设计不作限制

#### 代码规范

- 按照日常要求的代码规范来写

#### 流程规范

- 小组内可以自行商定合作方式（保证每个组员都有贡献）

#### 项目资源

- 产品原型：见代码库根目录的`prototype.svg`文件
- 用户故事：见代码库根目录的`user-stories.md`文件
- 电影数据（仅供参考，不作限制，推荐使用豆瓣api）：见代码库根目录的`movies.csv`文件或者[豆瓣api](https://www.kancloud.cn/movie/doubanapi/1012089)

### 输出结果

将团队练习代码库地址提交到作业指定的位置。

代码库需包含：

- 说明如何运行的README.md文件

## 如何开始：

- 由每个团队的一名成员Fork，把其他学员添加协作者，共同使用这一代码库协作开发。

## 如何启动项目(如果使用数据来源一，请忽略下面的 API 请求)

1. 请在 `client` 目录下开发；

2. 需要请求 API 时，请在根目录下打开终端输入 `npm run start`；

3. API 请求规则：
  - basic url：`http://127.0.0.1:8888`
  - path url：如 `/v2/movie/···`
  - 所有请求都需要传入参数 `apikey=0df993c66c0c636e29ecbb5344252a4a`
  - 所需请求都是获取数据，注意请求方法
  - 具体 API 说明[请参考](https://www.kancloud.cn/movie/doubanapi/1012068)，注意 **搜索** 请求已无法使用，建议项目中先请求 `电影Top250`，然后对其请求结果进行搜索；
  - 请求示例代码：

  ```请求电影详情
    var BASIC_URL = 'http://127.0.0.1:8888';
    var movieId = '26942674';

    ajax({
      url: BASIC_URL + '/v2/movie/subject/' + movieId,
      method: // request method
      data: {
        apikey: '0df993c66c0c636e29ecbb5344252a4a'
        // other request params
      },
      // other 
    });
  ```
  
  4. 注意：分类可以先查询top250，然后前台对这些电影数据的类别做汇总，然后列出所有电影的分类。
