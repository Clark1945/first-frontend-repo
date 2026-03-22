# Frontend 學習筆記

記錄這幾天學習 HTML、CSS、JavaScript 的重點知識。

---

## HTML

### 基本結構
```html
<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  <h1>標題</h1>
  <p>段落內容</p>
</body>
</html>
```

### 常用元素
| 元素 | 用途 |
|------|------|
| `<h1>` ~ `<h6>` | 標題 |
| `<p>` | 段落 |
| `<div>` | 區塊容器 |
| `<ul>` / `<li>` | 無序清單 |
| `<input>` | 輸入欄位 |
| `<button>` | 按鈕 |

---

## CSS

### 選擇器
```css
h1 { }          /* 元素選擇器 */
#section1 { }   /* ID 選擇器 */
.content { }    /* Class 選擇器 */
```

### 常用屬性
```css
color: red;
font-size: 24px;
margin: 16px;
padding: 8px;
border: 1px solid #ccc;
background: #f0f0f0;
border-radius: 8px;
```

### Flexbox 排版
```css
.container {
  display: flex;
  flex-direction: column;      /* 垂直排列（預設 row 水平） */
  justify-content: flex-start; /* 主軸對齊 */
  align-items: center;         /* 交叉軸對齊 */
  height: 100vh;               /* 整個視窗高度 */
}
```

### CSS Grid 排版
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3欄，每欄平均分配 */
  gap: 16px;                             /* 欄列間距 */
}
```

### Box Model
```css
* { box-sizing: border-box; } /* padding/border 不撐大元素，推薦全局設定 */
```

---

## JavaScript

### 變數宣告
```js
var name = "Clark";   // 舊寫法，盡量不用
let age = 30;         // 可重新賦值
const PI = 3.14;      // 不可重新賦值（但物件/陣列內容可改）
```

### 資料型別
```js
typeof undefined  // "undefined"
typeof "hello"    // "string"
typeof 42         // "number"
typeof true       // "boolean"
typeof {}         // "object"
```

### Template Literal（模板字串）
```js
const name = "Clark";
const msg = `My name is ${name}`; // 用反引號 ` 包起來
```

### 字串（String）
```js
// 字串是 immutable（不可變）
let str = "hello";
str[0] = "H";                  // 無效！str 還是 "hello"
let upper = str.toUpperCase(); // 回傳新字串，原字串不變
str.substring(0, 2);           // "he"
```

### 陣列（Array）
```js
let arr = [1, 2, 3];
arr.slice(0, 2);   // [1, 2] 取子陣列（不修改原陣列）
arr.push(4);       // 尾端加入
arr.pop();         // 尾端移除
arr.shift();       // 頭部移除並回傳
arr.unshift(0);    // 頭部加入
```

### 函式（Function）
```js
// 一般函式
function greet(name, greeting = "Hello") {
  return `${greeting}, ${name}`;
}

// 箭頭函式
const currentDate = () => new Date();
const myConcat = (arr1, arr2) => arr1.concat(arr2);

// IIFE（宣告完立刻執行）
(function() {
  console.log("Hi!");
})();

// Rest Operator（把多個參數收成陣列）
function sum(...args) {
  console.log(args); // [1, 2, 3, 4]
}
```

### 物件（Object）
```js
let obj = { name: "Clark", age: 30 };
obj.name;             // 取值（點記法）
obj["age"];           // 取值（括號記法）
obj.location = "USA"; // 新增屬性
delete obj.location;  // 刪除屬性

// 深拷貝
const newObj = JSON.parse(JSON.stringify(obj));

// 防止修改
Object.freeze(obj);

// 物件方法簡寫（ES6）
const bicycle = {
  gear: 2,
  setGear(newGear) {
    this.gear = newGear;
  }
};
```

### 高階函式（Higher-order Functions）
```js
const nums = [1, 2, -3, 4, -5];

nums.filter(n => n > 0);              // [1, 2, 4]  篩選
nums.map(n => n * n);                 // [1, 4, 9, 16, 25]  轉換
nums.reduce((sum, n) => sum + n, 0);  // -1  累加
nums.find(n => n > 3);                // 4  找第一個符合的元素

// 鏈式組合：正數加總
nums
  .filter(n => n > 0)
  .reduce((sum, n) => sum + n, 0);    // 7
```

### Spread 展開運算子
```js
const arr1 = [1, 2, 3];
const arr2 = [...arr1]; // 淺拷貝，arr1 改動不影響 arr2
```

### Destructuring 解構賦值
```js
// 陣列解構（可跳過元素）
const [a, b, , d] = [1, 2, 3, 4]; // a=1, b=2, d=4

// 物件解構（只取需要的屬性）
function half({ max, min }) {
  return (max + min) / 2;
}
```

### Class（ES6）
```js
class SpaceShuttle {
  constructor(targetPlanet) {
    this.targetPlanet = targetPlanet;
  }
}
const zeus = new SpaceShuttle("Jupiter");

// Getter / Setter
class Thermostat {
  constructor(fahrenheit) {
    this._temp = 5 / 9 * (fahrenheit - 32); // 內部存攝氏
  }
  get temperature() { return this._temp; }
  set temperature(val) { this._temp = val; }
}
const thermos = new Thermostat(76);
thermos.temperature = 26; // 使用 setter
```

### 模組（Modules）
```js
// cook.js — 匯出
export const makePizza = () => "Pizza";

// main.js — 匯入
import { makePizza } from './cook.js';
```

> 和 Java 比較：Java 的 `public class` 預設公開；JS 所有東西預設私有，需要 `export` 才能讓外部使用。

---

## DOM 操作

### 選取元素
```js
document.querySelector("#btn");   // 用 ID 選取
document.querySelector(".card");  // 用 Class 選取
```

### 修改內容 & 建立元素
```js
element.textContent = "新內容";

const li = document.createElement("li");
li.textContent = "清單項目";
list.appendChild(li);
```

### Event Listener（事件監聽）
```js
btn.addEventListener("click", () => {
  result.textContent = `こんにちは、${input.value}さん！`;
});
```

---

## 非同步（Async）

### Promise
有三種狀態：`pending`（等待）、`fulfilled`（成功）、`rejected`（失敗）

```js
fetch("/api/users")
  .then(res => res.json())         // 把 Response body 解析成 JS 物件
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### async / await（推薦寫法，像同步一樣好讀）
```js
async function getUsers() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await res.json();
    users.forEach(user => console.log(user.name));
  } catch (error) {
    console.error(error);
  }
}
```

---

## 練習檔案對照

| 檔案 | 練習內容 |
|------|---------|
| `sample.css` | CSS 基本選擇器、字體、間距 |
| `sample.html` | CSS Flexbox 置中排版 |
| `sample2.html` | CSS Grid 三欄排版 |
| `sample3.html` | JavaScript 基礎語法、物件、陣列、Class、模組 |
| `sample4.html` | DOM 操作、Event Listener、陣列高階函式、Promise / async-await |
| `sample5.html` | fetch API 實戰、動態渲染清單 |
