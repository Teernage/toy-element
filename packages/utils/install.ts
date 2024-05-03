import type { App, Plugin } from "vue";
import { each } from "lodash-es";

type SFCWithInstall<T> = T & Plugin;

/**
makeInstaller返回值 实际上是一个回调函数，在这个回调函数内部包含了组件集合的遍历，每个组件都是通过 withInstall 方法被添加了 install 方法。当调用 app.use(makeInstaller返回值) makeInstaller返回值 中保存的逻辑会依次执行，对每个组件调用其自身的 install 方法，从而实现这些组件的全局挂载。

 * @param component 组件集合
 * @returns 
 */
export function makeInstaller(component:Plugin[]){
  const install = (app:App)=>{
    each(component,(c)=>{
      app.use(c)
    })
  }
  return install
}


/**
 * 调用 withInstall 方法，每个 Vue 组件都会被赋予一个 install 方法，使得该组件可以像 Vue 插件一样被安装到 Vue 应用中，在 Vue 应用中，通常使用 app.use() 方法来全局注册组件或插件，但是普通的 Vue 组件是没有 install 方法的，因此无法直接通过 app.use() 注册。通过 withInstall 方法的处理，每个组件就被封装成一个带有 install 方法的插件，可以被轻松地整体或单独地注册到 Vue 应用中
 * @param component 
 * @returns 
 */
export const withInstall = <T>(component:T) =>{
  (component as SFCWithInstall<T>).install = (app:App)=>{
    const name = (component as any).name || 'UnnamedComponent'
    // 注册全局组件
    app.component(name, component as SFCWithInstall<T>)
  }
  return component as SFCWithInstall<T>
}



// 例子：
/**
 * 步骤 1: 使用 withInstall 包装每个组件
首先，对每个想要作为插件使用的组件，使用 withInstall 函数来包装。这样每个组件都会获得一个 install 方法，让它们得以通过 Vue.use() 方式被注册。这一步确保每个组件可以独立地作为插件使用。

// 假设有一个Vue组件 MyComponent
import MyComponent from './MyComponent.vue';

// 使用withInstall包装
const MyComponentWithInstall = withInstall(MyComponent);
步骤 2: 使用 makeInstaller 创建一个集中安装器
然后，我们通过 makeInstaller 函数创建一个安装函数，这个函数将这些被 withInstall 处理过的组件作为插件一次性批量注册到Vue应用中。

// 假设你有多个组件已经被 withInstall 处理
import MyComponentWithInstall from './components/MyComponentWithInstall';
import AnotherComponentWithInstall from './components/AnotherComponentWithInstall';

// 使用makeInstaller创建一个安装函数
const installAll = makeInstaller([MyComponentWithInstall, AnotherComponentWithInstall]);
步骤 3: 在 Vue 应用中使用创建的安装器
最后，当创建Vue应用 (createApp) 时，使用步骤2中创建的 installAll 函数来批量安装所有组件。

import { createApp } from 'vue';
import App from './App.vue';

// 之前创建的包含所有组件的安装器
import installAll from './installAll';

const app = createApp(App);

// 使用安装器批量注册组件
app.use(installAll);

app.mount('#app');
 */