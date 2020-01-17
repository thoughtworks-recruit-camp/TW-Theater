# 本地API 说明
* API root: `http://localhost:8888`
1. `/movies` , 返回相应的电影基本信息数组, 必要参数:
   * `genre`: 取值可以为`全部`或者类别的中文（如`犯罪`)
   * `sorting`: 取值可以为`top`(综合排序)或`random`(随机)
   * `limit`: `0`为不限制条数
   
2. `/details`, 返回特定电影的详细信息, 必要参数:
   * `id`: 目标电影的ID
   
3. `/poster` 返回特定电影的海报图片, 必要参数:
   * `id`: 目标电影的ID
   
4. `/search` 返回包含搜索关键字的电影基本信息数组, 必要参数:
   * `keyword`: 搜索关键字
   
5. `/genres` 返回类别数组(按热度倒序)