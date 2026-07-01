---
title: Github+Hexo实现免费博客方案   
---

# Github+Hexo实现免费博客方案

博客作为分享内容的平台，已经是很多持续学习者必不可少的工具。但是公网IP和服务器资源存在开销，所以免费的博客方案就应运而生。

互联网上已经有了很多的成熟方案，经过几番对比，我选择用Github+Hexo的组合实现免费博客方案。因为Hexo基于node.js，还有丰富的主题可供选择，初次之外该工具还支持各种功能扩展，总的来说符合我的个人需求。

Github提供git仓库，git管理，github action提供CI/CD自动化，github page托管静态页面构成的网站；Hexo则提供对markdown文件渲染，以及基本的网站框架。

以下分为几个部分展开讲，力求对各个模块有个功能上的简单概括，对整个方案的技术体系，以及整个方案的业务流程有个完整的叙述。

## 对github和hexo的简单概括

### github

github原本是版本控制和团队协作的公共仓库平台，在逐步完善配套的辅助功能后，已经成为了多功能的开源内容共享平台。

在这里，我们重点介绍几个辅助功能。

#### github page

github page服务是建立在一个特例化仓库（用户名.github.io）之上的，在对该仓库进行简单的page服务配置后，它就成为静态网站的托管平台。具体的操作可以AI，这里不再赘述。

#### github action

github action提供CI/CD自动化部署服务，主要涉及到利用git的分支操作，对博客网站的源码和生成的静态网页做一个隔离操作。然后监听push事件触发action拉取源码，github action提供自动化解释和渲染，以及最终的部署。

实际操作分三个部分，一是git的main分支和gh-pages分支，前者用于我们push博客网站的源码，后者用于action插件构建和部署渲染后的静态网页，命名gh-pages属于接口规范必须实现。二是配置github action的yml文件。三是给github page所在的仓库配置访问token,让github action能利用token访问仓库。

对main分支和gh-pages分支做一个简单的概括说明。main分支是网站源码所在的分支，所有的修改都push到这个分支上，而gh-pages是github action插件在CI/CD过程中创建和维护的分支，该分支提交Hexo项目下public文件夹的内容。

关于github action的deploy.yml配置文件的实际操作问题。GitHub仓库开启了默认的Pages自动构建，该构建默认适配Jekyll引擎，如果我们用的是hexo引擎，那么就要把仓库配置项“自动构建”改为基于Action的自定义发布流程

附上一个经过实践检验的配置文件模板deploy.yml

``` yml
name: Deploy Hexo Blog

on:
  push:
    branches:
      - main  # 根据您的源码分支名称修改

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source
        uses: actions/checkout@v4  

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20' # 指定 Node.js 版本

      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Install Dependencies
        run: npm install

      - name: Generate Static Files
        run:  
          npm install hexo-cli -g
          hexo generate

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3 #该插件是一个非常流行的 GitHub Actions 插件（Action），用于自动化将静态网站或构建产物部署到 GitHub Pages
        with:
          personal_token: ${{ secrets.HEXO_TOKEN }}
          external_repository: 你的账户名/你的账户名.github.io # 替换为您的 Pages 仓库
          publish_dir: ./public
          publish_branch: gh-pages # 存放静态文件的分支
          commit_message: ${{ github.event.head_commit.message }}

```

### 阶段总结

以上是大致流程，粗粒度的细节说明，起到提供思路的作用。按照这个思路，搭配AI的补充，基本就能有个正确的实践。为啥不把自己完整的实践过程写下来，因为版本持续在更迭内容可能会过时，以及网上相关的实践讲解内容特别多，太详尽的表述缺乏意义和价值。