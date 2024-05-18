import { For, createSignal, onMount } from "solid-js";
import "./App.css";

function App() {
  const [list, setList] = createSignal<number[]>([]);
  // コンポーネントがマウントされたときにローカルストレージからデータを取得してリストを初期化
  onMount(async () => {
    const localList = await storage.getItem<number[]>("local:ExcludeList");
    // console.log(localList);
    setList(localList || []);
  });
  const [inputValue, setInputValue] = createSignal("");

  const handleInputChange = (e: { target: { value: any } }) => {
    setInputValue(e.target.value);
  };

  const handleAddNumber = () => {
    const number = parseInt(inputValue());
    if (!isNaN(number) && !list().includes(number)) {
      setList([...list(), number]); // 新しい配列を作成して追加
      setInputValue(""); // 入力フィールドをリセット
    }
  };

  const handleClickDeleteNum = (index: number) => {
    const newList = list().filter((_, i) => i !== index);
    setList(newList);
  };
  const handleClosePopup = async () => {
    // リストをローカルストレージに保存する
    await storage.setItem("local:ExcludeList", list());
    window.close();
  };

  return (
    <>
      <h1>Exclude Number List</h1>

      <div class="numList">
        <For each={list()} fallback={<div>No items</div>}>
          {(item, index) => (
            <button
              type="button"
              title="delete"
              onClick={() => {
                handleClickDeleteNum(index());
              }}
              data-index={index()}
            >
              {item} ❌️
            </button>
          )}
        </For>
      </div>

      <div class="inputButton">
        <input
          placeholder="0"
          type="number"
          value={inputValue()}
          onInput={handleInputChange}
        />
        <button type="button" onClick={handleAddNumber}>
          Add
        </button>
      </div>

      <button type="button" onClick={handleClosePopup}>
        SAVE
      </button>

      <p class="read-the-docs">
        Click on the WXT and Solid logos to learn more
      </p>
    </>
  );
}

export default App;
