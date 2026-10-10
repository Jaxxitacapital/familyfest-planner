import React, {useEffect, useMemo, useState} from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  Home,
  Utensils,
  WalletCards,
  ShoppingCart,
  BarChart3,
  Music2,
  Search,
  Printer,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Camera
} from "lucide-react";

import {kenyanMeals} from "./data/kenyanMeals";
import {seedPrices} from "./data/prices";
import StatCard from "./components/StatCard";
import PhotosGallery from "./components/PhotosGallery";

const money = n => `KSh ${Math.round(n).toLocaleString()}`;

const STORAGE = "familyfest-v2";

const initialItems = [
  {
    id: "chicken",
    priceId: "chicken",
    name: "Chicken",
    qty: 5,
    planned: 600,
    actual: 600,
    unit: "each",
    done: false,
    category: "Protein"
  },
  {
    id: "beef",
    priceId: "beef",
    name: "Beef",
    qty: 2,
    planned: 800,
    actual: 800,
    unit: "kg",
    done: false,
    category: "Protein"
  },
  {
    id: "banana",
    priceId: "banana",
    name: "Green bananas",
    qty: 28 / 3,
    planned: 20,
    actual: 20,
    unit: "3 bananas",
    done: false,
    category: "Staple"
  },
  {
    id: "milk",
    priceId: "milk",
    name: "Milk",
    qty: 5,
    planned: 70,
    actual: 70,
    unit: "litre",
    done: false,
    category: "Dairy"
  },
  {
    id: "starter",
    priceId: "starter",
    name: "Yoghurt starter",
    qty: 1,
    planned: 130,
    actual: 130,
    unit: "500 ml",
    done: false,
    category: "Dairy"
  },
  {
    id: "oil",
    priceId: "oil",
    name: "Cooking oil",
    qty: 2,
    planned: 280,
    actual: 280,
    unit: "2 L",
    done: false,
    category: "Cooking"
  },
  {
    id: "salt",
    priceId: "salt",
    name: "Salt",
    qty: 1,
    planned: 25,
    actual: 25,
    unit: "pack",
    done: false,
    category: "Cooking"
  },
  {
    id: "groceries",
    priceId: "groceries",
    name: "General groceries",
    qty: 1,
    planned: 300,
    actual: 300,
    unit: "allowance",
    done: false,
    category: "Other"
  },
  {
    id: "wheat",
    priceId: "wheat",
    name: "Wheat flour",
    qty: 0.5,
    planned: 50,
    actual: 50,
    unit: "0.5 kg",
    done: false,
    category: "Staple"
  },
  {
    id: "charcoal",
    priceId: "charcoal",
    name: "Charcoal",
    qty: 3,
    planned: 90,
    actual: 90,
    unit: "bag",
    done: false,
    category: "Fuel"
  }
];

function App() {
  const [state, setState] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(STORAGE)) || {
          people: 14,
          contribution: 500,
          items: initialItems,
          activeMeal: null,
          music: [],
          tab: "dashboard"
        }
      );
    } catch {
      return {
        people: 14,
        contribution: 500,
        items: initialItems,
        activeMeal: null,
        music: [],
        tab: "dashboard"
      };
    }
  });

  const [tab, setTab] = useState(state.tab || "dashboard");
  const [query, setQuery] = useState("");
  const [online, setOnline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [budgetStyle, setBudgetStyle] = useState("Balanced");

  useEffect(() => {
    localStorage.setItem(
      STORAGE,
      JSON.stringify({
        ...state,
        tab
      })
    );
  }, [state, tab]);

  const budget = state.people * state.contribution;

  const planned = state.items.reduce(
    (s, i) => s + i.qty * i.planned,
    0
  );

  const actual = state.items.reduce(
    (s, i) => s + i.qty * i.actual,
    0
  );

  const remaining = budget - planned;
  const actualRemaining = budget - actual;

  const costPer = state.people
    ? actual / state.people
    : 0;

  const categories = useMemo(() => {
    const m = {};

    state.items.forEach(i => {
      m[i.category] =
        (m[i.category] || 0) +
        i.qty * i.planned;
    });

    return Object.entries(m).map(
      ([name, value]) => ({
        name,
        value
      })
    );
  }, [state.items]);

  const update = patch =>
    setState(s => ({
      ...s,
      ...patch
    }));

  const updateItem = (id, key, value) =>
    setState(s => ({
      ...s,
      items: s.items.map(i =>
        i.id === id
          ? {
              ...i,
              [key]: Number.isNaN(Number(value))
                ? value
                : Number(value)
            }
          : i
      )
    }));

  const toggle = id =>
    setState(s => ({
      ...s,
      items: s.items.map(i =>
        i.id === id
          ? {
              ...i,
              done: !i.done
            }
          : i
      )
    }));

  const remove = id =>
    setState(s => ({
      ...s,
      items: s.items.filter(i => i.id !== id)
    }));

  const addMeal = meal => {
    const priceMap = Object.fromEntries(
      seedPrices.map(p => [p.id, p])
    );

    const added = meal.ingredients
      .map((x, idx) => {
        const p = priceMap[x.priceId];

        if (!p) return null;

        return {
          id: `${x.priceId}-${Date.now()}-${idx}`,
          priceId: p.id,
          name: p.name,
          qty: x.qty,
          planned: p.price,
          actual: p.price,
          unit: p.unit,
          done: false,
          category: p.category
        };
      })
      .filter(Boolean);

    const merged = [...state.items];

    added.forEach(a => {
      const existing = merged.find(
        i => i.priceId === a.priceId
      );

      if (existing) {
        existing.qty = Math.max(
          existing.qty,
          a.qty
        );
      } else {
        merged.push(a);
      }
    });

    update({
      items: merged,
      activeMeal: meal
    });

    setTab("budget");
  };

  const generateRecommendations = () => {
    return kenyanMeals
      .map(m => {
        const priceMap = Object.fromEntries(
          seedPrices.map(p => [p.id, p])
        );

        const cost = m.ingredients.reduce(
          (s, x) =>
            s +
            (priceMap[x.priceId]?.price || 0) *
              x.qty,
          0
        );

        const score =
          budgetStyle === "Economy"
            ? -cost
            : budgetStyle === "Celebration"
            ? Math.abs(7000 - cost)
            : Math.abs(budget * 0.9 - cost);

        return {
          ...m,
          cost,
          score
        };
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  };

  async function searchOnline() {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const local = kenyanMeals.filter(m =>
        (
          m.name +
          " " +
          m.tags.join(" ")
        )
          .toLowerCase()
          .includes(query.toLowerCase())
      );

      const res = await fetch(
        `/api/recipes?q=${encodeURIComponent(query)}`
      );

      const data = await res.json();

      setOnline([
        {
          source: "Local",
          items: local
        },
        {
          source: "TheMealDB",
          items: data.meals || []
        }
      ]);
    } catch {
      setOnline([
        {
          source: "Local",
          items: kenyanMeals.filter(m =>
            m.name
              .toLowerCase()
              .includes(query.toLowerCase())
          )
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function printPlan() {
    window.print();
  }

  function reset() {
    if (
      confirm(
        "Reset this event to the starter KSh 7,000 plan?"
      )
    ) {
      setState({
        people: 14,
        contribution: 500,
        items: initialItems,
        activeMeal: null,
        music: [],
        tab: "dashboard"
      });

      setTab("dashboard");
    }
  }

  const nav = [
    ["dashboard", "Dashboard", Home],
    ["meals", "Meal Planner", Utensils],
    ["budget", "Budget", WalletCards],
    ["shopping", "Shopping", ShoppingCart],
    ["analysis", "Analysis", BarChart3],
    ["music", "Music Lobby", Music2],
    ["search", "Food Search", Search],
    ["photos", "Photos & Memories", Camera]
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            🍲
          </div>

          <div>
            <b>FamilyFest</b>
            <small>Planner 2.0</small>
          </div>
        </div>

        <div className="event-pill">
          <span>LIVE EVENT</span>

          <b>School Family Cooking</b>

          <small>
            {state.people} people · {money(budget)}
          </small>
        </div>

        <nav>
          {nav.map(([id, label, Icon]) => (
            <button
              className={
                tab === id ? "active" : ""
              }
              onClick={() => setTab(id)}
              key={id}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="side-bottom">
          <button onClick={printPlan}>
            <Printer size={18} />
            Print plan
          </button>

          <button onClick={reset}>
            <RotateCcw size={18} />
            Reset demo
          </button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <div className="eyebrow">
              SCHOOL FAMILY COOKING · KENYA
            </div>

            <h1>
              {tab === "dashboard"
                ? "Plan the meal. Control the budget. Enjoy the day."
                : nav.find(n => n[0] === tab)?.[1]}
            </h1>
          </div>

          <div className="header-actions">
            <button
              className="icon-btn"
              onClick={printPlan}
            >
              <Printer size={18} />
            </button>

            <div className="avatar">
              EK
            </div>
          </div>
        </header>

        <section className="content">
          {tab === "dashboard" && (
            <Dashboard
              {...{
                state,
                update,
                budget,
                planned,
                actual,
                remaining,
                actualRemaining,
                costPer,
                categories,
                setTab,
                generateRecommendations,
                addMeal
              }}
            />
          )}

          {tab === "meals" && (
            <Meals
              {...{
                budgetStyle,
                setBudgetStyle,
                budget,
                generateRecommendations,
                addMeal
              }}
            />
          )}

          {tab === "budget" && (
            <Budget
              {...{
                state,
                updateItem,
                remove,
                budget,
                planned,
                actual,
                remaining,
                actualRemaining
              }}
            />
          )}

          {tab === "shopping" && (
            <Shopping
              {...{
                state,
                toggle,
                planned
              }}
            />
          )}

          {tab === "analysis" && (
            <Analysis
              {...{
                state,
                budget,
                planned,
                actual,
                costPer,
                categories
              }}
            />
          )}

          {tab === "music" && (
            <Music
              {...{
                state,
                update
              }}
            />
          )}

          {tab === "search" && (
            <SearchPage
              {...{
                query,
                setQuery,
                searchOnline,
                online,
                loading,
                addMeal
              }}
            />
          )}

          {tab === "photos" && (
            <PhotosGallery />
          )}
        </section>
      </main>
    </div>
  );
}

function Dashboard({
  state,
  update,
  budget,
  planned,
  actual,
  remaining,
  actualRemaining,
  costPer,
  categories,
  setTab,
  generateRecommendations,
  addMeal
}) {
  const rec = generateRecommendations()[0];

  return (
    <div>
      <div className="hero-grid">
        <div className="hero-card">
          <div className="hero-copy">
            <span className="tag">
              YOUR LIVE EVENT
            </span>

            <h2>
              Good food. Smart money. Great memories.
            </h2>

            <p>
              Everything updates as you change
              people, contributions, quantities
              and prices.
            </p>

            <div className="hero-buttons">
              <button
                className="primary"
                onClick={() => setTab("meals")}
              >
                Build a meal
                <Utensils size={16} />
              </button>

              <button
                className="secondary"
                onClick={() => setTab("budget")}
              >
                Manage budget
              </button>
            </div>
          </div>

          <div className="hero-food">
            🍗
            <span>🍚</span>
            <i>🥗</i>
          </div>
        </div>

        <div className="mini-card">
          <span>Budget health</span>

          <strong
            className={
              remaining >= 0
                ? "good"
                : "bad"
            }
          >
            {remaining >= 0
              ? "UNDER BUDGET"
              : "OVER BUDGET"}
          </strong>

          <div className="progress">
            <i
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    planned / budget * 100
                  )
                )}%`
              }}
            />
          </div>

          <small>
            {Math.round(
              planned / budget * 100
            )}
            % of budget planned
          </small>
        </div>
      </div>

      <div className="stats">
        <StatCard
          label="People"
          value={state.people}
          sub="participants"
        />

        <StatCard
          label="Contribution"
          value={money(
            state.contribution
          )}
          sub="per person"
        />

        <StatCard
          label="Total budget"
          value={money(budget)}
          sub="available"
        />

        <StatCard
          label="Planned spend"
          value={money(planned)}
          sub={`${money(
            Math.max(0, remaining)
          )} remaining`}
          tone={
            remaining < 0
              ? "danger"
              : ""
          }
        />

        <StatCard
          label="Actual spend"
          value={money(actual)}
          sub={`${money(
            actualRemaining
          )} balance`}
          tone={
            actualRemaining < 0
              ? "danger"
              : ""
          }
        />
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Event controls</h3>

              <p>
                Change these inputs and every
                calculation updates.
              </p>
            </div>
          </div>

          <div className="input-grid">
            <label>
              Number of people

              <input
                type="number"
                min="1"
                value={state.people}
                onChange={e =>
                  update({
                    people: +e.target.value
                  })
                }
              />
            </label>

            <label>
              Contribution / person

              <input
                type="number"
                min="0"
                value={state.contribution}
                onChange={e =>
                  update({
                    contribution:
                      +e.target.value
                  })
                }
              />
            </label>
          </div>

          <div className="budget-line">
            <span>Cost per person</span>
            <b>{money(costPer)}</b>
          </div>

          <div className="budget-line">
            <span>Actual balance</span>

            <b
              className={
                actualRemaining < 0
                  ? "bad"
                  : "good"
              }
            >
              {money(actualRemaining)}
            </b>
          </div>
        </div>

        <div className="panel recommendation">
          <div className="sparkle">
            <Sparkles size={20} />
          </div>

          <div>
            <span className="tag">
              SMART SUGGESTION
            </span>

            <h3>{rec.name}</h3>

            <p>
              Estimated starter cost{" "}
              {money(rec.cost)}. Compare this
              with your current plan before
              shopping.
            </p>

            <button
              className="link-btn"
              onClick={() =>
                addMeal(rec)
              }
            >
              Use this meal →
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>
              Spending at a glance
            </h3>

            <p>
              Your biggest budget categories.
            </p>
          </div>

          <button
            className="secondary"
            onClick={() =>
              setTab("analysis")
            }
          >
            Open analysis
          </button>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <BarChart data={categories}>
              <XAxis dataKey="name" />
              <YAxis />

              <Tooltip
                formatter={v => money(v)}
              />

              <Bar
                dataKey="value"
                radius={[
                  7,
                  7,
                  0,
                  0
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Meals({
  budgetStyle,
  setBudgetStyle,
  budget,
  generateRecommendations,
  addMeal
}) {
  const rec =
    generateRecommendations();

  return (
    <div>
      <div className="toolbar">
        <div>
          <h2>Meal variety</h2>

          <p>
            Generate options based on your
            budget style.
          </p>
        </div>

        <select
          value={budgetStyle}
          onChange={e =>
            setBudgetStyle(
              e.target.value
            )
          }
        >
          <option>Economy</option>
          <option>Balanced</option>
          <option>Celebration</option>
        </select>
      </div>

      <div className="meal-grid">
        {rec.map(m => (
          <MealCard
            key={m.id}
            meal={m}
            budget={budget}
            addMeal={addMeal}
          />
        ))}
      </div>

      <h3 className="section-title">
        All Kenyan starter meals
      </h3>

      <div className="meal-grid">
        {kenyanMeals.map(m => (
          <MealCard
            key={m.id}
            meal={{
              ...m,
              cost:
                m.ingredients.reduce(
                  (s, x) =>
                    s +
                    (seedPrices.find(
                      p =>
                        p.id ===
                        x.priceId
                    )?.price || 0) *
                      x.qty,
                  0
                )
            }}
            budget={budget}
            addMeal={addMeal}
          />
        ))}
      </div>
    </div>
  );
}

function MealCard({
  meal,
  budget,
  addMeal
}) {
  return (
    <article className="meal-card">
      <img
        src={meal.photo}
        alt={meal.name}
      />

      <div className="meal-body">
        <div className="tag-row">
          <span className="tag">
            {meal.category}
          </span>

          <span>
            {meal.cost <= budget
              ? "✓ fits"
              : "⚠ check budget"}
          </span>
        </div>

        <h3>{meal.name}</h3>

        <p>{meal.description}</p>

        <div className="meal-cost">
          <strong>
            {money(meal.cost)}
          </strong>

          <small>
            starter estimate
          </small>
        </div>

        <button
          className="primary full"
          onClick={() =>
            addMeal(meal)
          }
        >
          Add to event
          <Plus size={16} />
        </button>
      </div>
    </article>
  );
}

function Budget({
  state,
  updateItem,
  remove,
  budget,
  planned,
  actual,
  remaining,
  actualRemaining
}) {
  return (
    <div>
      <div className="stats">
        <StatCard
          label="Available"
          value={money(budget)}
        />

        <StatCard
          label="Planned"
          value={money(planned)}
        />

        <StatCard
          label="Actual"
          value={money(actual)}
        />

        <StatCard
          label="Variance"
          value={money(
            actual - planned
          )}
          tone={
            actual > planned
              ? "danger"
              : "good"
          }
        />
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>
              Editable price database
            </h3>

            <p>
              Change planned or actual prices
              when you visit the market.
            </p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Planned</th>
                <th>Actual</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {state.items.map(i => (
                <tr key={i.id}>
                  <td>
                    <b>{i.name}</b>
                    <small>
                      {i.category}
                    </small>
                  </td>

                  <td>
                    <input
                      className="tiny"
                      type="number"
                      step=".1"
                      value={i.qty}
                      onChange={e =>
                        updateItem(
                          i.id,
                          "qty",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>{i.unit}</td>

                  <td>
                    <input
                      className="tiny"
                      type="number"
                      value={i.planned}
                      onChange={e =>
                        updateItem(
                          i.id,
                          "planned",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      className="tiny"
                      type="number"
                      value={i.actual}
                      onChange={e =>
                        updateItem(
                          i.id,
                          "actual",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <b>
                      {money(
                        i.qty *
                          i.actual
                      )}
                    </b>
                  </td>

                  <td>
                    <button
                      className="danger-btn"
                      onClick={() =>
                        remove(i.id)
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={`balance-banner ${
          actualRemaining < 0
            ? "over"
            : ""
        }`}
      >
        <div>
          <span>
            {actualRemaining < 0
              ? "Budget exceeded"
              : "Money remaining"}
          </span>

          <strong>
            {money(
              Math.abs(
                actualRemaining
              )
            )}
          </strong>
        </div>

        <p>
          {actualRemaining < 0
            ? "Reduce quantities or choose a cheaper meal."
            : "Keep a reserve for price changes, transport or missing ingredients."}
        </p>
      </div>
    </div>
  );
}

function Shopping({
  state,
  toggle,
  planned
}) {
  const done =
    state.items.filter(
      i => i.done
    ).length;

  return (
    <div>
      <div className="toolbar">
        <div>
          <h2>
            Shopping checklist
          </h2>

          <p>
            {done} of{" "}
            {state.items.length}{" "}
            items marked purchased.
          </p>
        </div>

        <div className="check-progress">
          {Math.round(
            done /
              state.items.length *
              100
          ) || 0}
          %
        </div>
      </div>

      <div className="shopping-list">
        {state.items.map(i => (
          <label
            className={
              i.done
                ? "shopping-item done"
                : "shopping-item"
            }
            key={i.id}
          >
            <input
              type="checkbox"
              checked={i.done}
              onChange={() =>
                toggle(i.id)
              }
            />

            <span>
              <b>{i.name}</b>

              <small>
                {i.qty} × {i.unit} ·{" "}
                {money(
                  i.qty *
                    i.planned
                )}
              </small>
            </span>

            <Check size={18} />
          </label>
        ))}
      </div>

      <div className="panel tip">
        <b>Shopping tip</b>

        <p>
          Update the Actual price column in
          Budget immediately after buying an
          item. This turns the checklist into a
          live spending tracker.
        </p>
      </div>
    </div>
  );
}

function Analysis({
  state,
  budget,
  planned,
  actual,
  costPer,
  categories
}) {
  const variance =
    actual - planned;

  const top = [
    ...state.items
  ].sort(
    (a, b) =>
      b.qty * b.actual -
      a.qty * a.actual
  )[0];

  return (
    <div>
      <div className="analysis-grid">
        <div className="panel">
          <h3>
            Budget performance
          </h3>

          <div className="big-number">
            {Math.round(
              actual /
                budget *
                100
            )}
            %
          </div>

          <p>
            of the available budget is
            currently committed to actual
            spending.
          </p>

          <div className="progress large">
            <i
              style={{
                width: `${Math.min(
                  100,
                  actual /
                    budget *
                    100
                )}%`
              }}
            />
          </div>
        </div>

        <div className="panel">
          <h3>
            Cost per person
          </h3>

          <div className="big-number">
            {money(costPer)}
          </div>

          <p>
            Based on current actual prices for{" "}
            {state.people} participants.
          </p>
        </div>

        <div className="panel">
          <h3>
            Largest item
          </h3>

          <div className="big-number">
            {top?.name || "—"}
          </div>

          <p>
            {top
              ? money(
                  top.qty *
                    top.actual
                )
              : ""}
          </p>
        </div>

        <div className="panel">
          <h3>
            Planned vs actual
          </h3>

          <div
            className={`big-number ${
              variance > 0
                ? "bad"
                : "good"
            }`}
          >
            {variance > 0
              ? "+"
              : ""}
            {money(variance)}
          </div>

          <p>
            {variance > 0
              ? "Actual spending is above plan."
              : "You are at or below plan."}
          </p>
        </div>
      </div>

      <div className="two-col">
        <div className="panel">
          <h3>
            Category mix
          </h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                label
              >
                {categories.map(
                  (_, i) => (
                    <Cell key={i} />
                  )
                )}
              </Pie>

              <Tooltip
                formatter={v =>
                  money(v)
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>
            Budget coaching
          </h3>

          <ul className="coach">
            <li>
              Start with the contribution:{" "}
              <b>
                {money(
                  state.contribution
                )} ×{" "}
                {state.people} ={" "}
                {money(budget)}
              </b>
              .
            </li>

            <li>
              Your current planned spend is{" "}
              <b>
                {money(planned)}
              </b>
              .
            </li>

            <li>
              Your current actual spend is{" "}
              <b>
                {money(actual)}
              </b>
              .
            </li>

            <li>
              If protein dominates the budget,
              compare a meat-heavy menu with
              beans, rice and vegetables before
              buying.
            </li>

            <li>
              Keep a reserve instead of spending
              every shilling before shopping.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Music({
  state,
  update
}) {
  const [song, setSong] =
    useState("");

  const [genre, setGenre] =
    useState("Afrobeats");

  const add = () => {
    if (!song.trim()) return;

    update({
      music: [
        ...(state.music || []),
        {
          id: Date.now(),
          song,
          genre,
          votes: 0
        }
      ]
    });

    setSong("");
  };

  const vote = id =>
    update({
      music: state.music.map(
        x =>
          x.id === id
            ? {
                ...x,
                votes:
                  x.votes + 1
              }
            : x
      )
    });

  const queue = [
    ...(state.music || [])
  ].sort(
    (a, b) =>
      b.votes - a.votes
  );

  return (
    <div>
      <div className="music-hero">
        <div>
          <span className="tag">
            MUSIC LOBBY
          </span>

          <h2>
            Cook, connect & celebrate.
          </h2>

          <p>
            Build a school-friendly queue
            together.
          </p>
        </div>

        <div className="music-note">
          🎵
        </div>
      </div>

      <div className="two-col">
        <div className="panel">
          <h3>
            Suggest a song
          </h3>

          <div className="input-grid">
            <label>
              Song / artist

              <input
                value={song}
                onChange={e =>
                  setSong(
                    e.target.value
                  )
                }
                placeholder="e.g. a Kenyan favourite"
              />
            </label>

            <label>
              Type

              <select
                value={genre}
                onChange={e =>
                  setGenre(
                    e.target.value
                  )
                }
              >
                {[
                  "Kenyan",
                  "Afrobeats",
                  "Gospel",
                  "Dance",
                  "Chill",
                  "Classics",
                  "School-friendly",
                  "Party"
                ].map(x => (
                  <option key={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            className="primary"
            onClick={add}
          >
            Add to queue
            <Plus size={16} />
          </button>
        </div>

        <div className="panel">
          <h3>
            Recommended stages
          </h3>

          <div className="stage">
            <b>🍳 Cooking</b>
            <span>
              Chill · Kenyan classics
            </span>
          </div>

          <div className="stage">
            <b>🍽️ Meal time</b>
            <span>
              Soft · Gospel · background
            </span>
          </div>

          <div className="stage">
            <b>🎉 Celebration</b>
            <span>
              Afrobeats · Dance · Party
            </span>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>
            Community queue
          </h3>

          <span>
            {queue.length} songs
          </span>
        </div>

        {queue.length === 0 ? (
          <div className="empty">
            No songs yet. Add the first one.
          </div>
        ) : (
          queue.map(x => (
            <div
              className="song-row"
              key={x.id}
            >
              <span className="song-icon">
                ♪
              </span>

              <div>
                <b>{x.song}</b>

                <small>
                  {x.genre}
                </small>
              </div>

              <button
                className="vote"
                onClick={() =>
                  vote(x.id)
                }
              >
                👍 {x.votes}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SearchPage({
  query,
  setQuery,
  searchOnline,
  online,
  loading,
  addMeal
}) {
  return (
    <div>
      <div className="search-box">
        <Search size={22} />

        <input
          value={query}
          onChange={e =>
            setQuery(
              e.target.value
            )
          }
          onKeyDown={e =>
            e.key === "Enter" &&
            searchOnline()
          }
          placeholder="Search chicken, rice, stew, pilau..."
        />

        <button
          className="primary"
          onClick={searchOnline}
        >
          {loading
            ? "Searching…"
            : "Search"}
        </button>
      </div>

      <div className="search-note">
        <Sparkles size={17} />

        Search first checks your Kenyan meal
        library and then calls the server's
        online recipe connector.
      </div>

      {!online.length ? (
        <div className="empty large-empty">
          Try <b>chicken</b>,{" "}
          <b>rice</b>,{" "}
          <b>beef</b> or{" "}
          <b>pilau</b>.
        </div>
      ) : (
        online.map(group => (
          <div
            className="search-group"
            key={group.source}
          >
            <h3>{group.source}</h3>

            {group.items.length === 0 ? (
              <p>No results.</p>
            ) : (
              <div className="result-list">
                {group.items.map(
                  (m, i) => (
                    <div
                      className="result-card"
                      key={
                        m.id || i
                      }
                    >
                      <div className="result-image">
                        {m.strMealThumb ? (
                          <img
                            src={
                              m.strMealThumb
                            }
                            alt={
                              m.strMeal
                            }
                          />
                        ) : m.photo ? (
                          <img
                            src={m.photo}
                            alt={
                              m.name
                            }
                          />
                        ) : (
                          <span>
                            🍛
                          </span>
                        )}
                      </div>

                      <div>
                        <b>
                          {m.strMeal ||
                            m.name}
                        </b>

                        <p>
                          {m.strArea ||
                            m.description ||
                            "Recipe result"}
                        </p>

                        {m.strMealThumb && (
                          <a
                            href={`https://www.themealdb.com/meal/${m.idMeal}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View source{" "}
                            <ExternalLink
                              size={13}
                            />
                          </a>
                        )}
                      </div>

                      {m.name && (
                        <button
                          className="secondary"
                          onClick={() =>
                            addMeal(m)
                          }
                        >
                          Add
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;