/**
 * NutriTrack - Vanilla Calorie & Macro Tracker
 * Pure Vanilla JavaScript with LocalStorage Persistence
 * No external libraries or frameworks
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_KEY_DATA = 'nutritrack_daily_data';
  const STORAGE_KEY_SETTINGS = 'nutritrack_user_settings';

  // Default User Settings
  const DEFAULT_SETTINGS = {
    calorieGoal: 2000,
    proteinGoal: 140,
    carbsGoal: 220,
    fatGoal: 65
  };

  // State
  let settings = { ...DEFAULT_SETTINGS };
  let allData = {};
  let currentDate = getTodayISO();

  // DOM Elements
  const activeDateInput = document.getElementById('active-date-input');
  const prevDateBtn = document.getElementById('prev-date-btn');
  const nextDateBtn = document.getElementById('next-date-btn');
  const todayBtn = document.getElementById('today-btn');
  const dateLabel = document.getElementById('date-label');

  // Summary Elements
  const caloriesConsumedEl = document.getElementById('calories-consumed');
  const calorieTargetEl = document.getElementById('calorie-target');
  const calorieProgressBar = document.getElementById('calorie-progress-fill');
  const calorieStatusText = document.getElementById('calorie-status-text');
  const calorieRemainingText = document.getElementById('calorie-remaining-text');

  const proteinConsumedEl = document.getElementById('protein-consumed');
  const proteinTargetEl = document.getElementById('protein-target');
  const proteinBarFill = document.getElementById('protein-bar-fill');

  const carbsConsumedEl = document.getElementById('carbs-consumed');
  const carbsTargetEl = document.getElementById('carbs-target');
  const carbsBarFill = document.getElementById('carbs-bar-fill');

  const fatConsumedEl = document.getElementById('fat-consumed');
  const fatTargetEl = document.getElementById('fat-target');
  const fatBarFill = document.getElementById('fat-bar-fill');

  // Water elements
  const waterCountEl = document.getElementById('water-count');
  const waterCupsRow = document.getElementById('water-cups');
  const addWaterBtn = document.getElementById('add-water-btn');
  const resetWaterBtn = document.getElementById('reset-water-btn');

  // Meal lists & form
  const foodForm = document.getElementById('food-form');
  const foodNameInput = document.getElementById('food-name');
  const mealCategorySelect = document.getElementById('meal-category');
  const foodCaloriesInput = document.getElementById('food-calories');
  const foodProteinInput = document.getElementById('food-protein');
  const foodCarbsInput = document.getElementById('food-carbs');
  const foodFatInput = document.getElementById('food-fat');
  const clearDayBtn = document.getElementById('clear-day-btn');

  // Meal groups
  const mealGroups = {
    breakfast: {
      list: document.getElementById('items-breakfast'),
      stats: document.getElementById('stats-breakfast')
    },
    lunch: {
      list: document.getElementById('items-lunch'),
      stats: document.getElementById('stats-lunch')
    },
    dinner: {
      list: document.getElementById('items-dinner'),
      stats: document.getElementById('stats-dinner')
    },
    snacks: {
      list: document.getElementById('items-snacks'),
      stats: document.getElementById('stats-snacks')
    }
  };

  // Modals & Actions
  const openSettingsBtn = document.getElementById('open-settings-btn');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const settingsForm = document.getElementById('settings-form');
  const settingCalGoalInput = document.getElementById('setting-cal-goal');
  const settingProteinGoalInput = document.getElementById('setting-protein-goal');
  const settingCarbsGoalInput = document.getElementById('setting-carbs-goal');
  const settingFatGoalInput = document.getElementById('setting-fat-goal');

  const exportBtn = document.getElementById('export-btn');
  const importFileInput = document.getElementById('import-file-input');
  const wipeAllDataBtn = document.getElementById('wipe-all-data-btn');

  // Edit Modal
  const editModal = document.getElementById('edit-modal');
  const closeEditBtn = document.getElementById('close-edit-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const editForm = document.getElementById('edit-form');
  const editItemId = document.getElementById('edit-item-id');
  const editFoodName = document.getElementById('edit-food-name');
  const editMealCategory = document.getElementById('edit-meal-category');
  const editCalories = document.getElementById('edit-calories');
  const editProtein = document.getElementById('edit-protein');
  const editCarbs = document.getElementById('edit-carbs');
  const editFat = document.getElementById('edit-fat');

  // Chart
  const weeklyChartCanvas = document.getElementById('weekly-chart');
  const chartTargetIndicator = document.getElementById('chart-target-indicator');

  // Helper: Format Date to YYYY-MM-DD
  function getTodayISO() {
    const today = new Date();
    return formatISO(today);
  }

  function formatISO(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseISODate(isoStr) {
    const parts = isoStr.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }

  // Load from LocalStorage
  function loadData() {
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (storedSettings) {
        settings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(storedSettings));
      } else {
        settings = { ...DEFAULT_SETTINGS };
      }

      const storedData = localStorage.getItem(STORAGE_KEY_DATA);
      if (storedData) {
        allData = JSON.parse(storedData);
      } else {
        // Initialize with default sample data for a pleasant first-time experience
        allData = createInitialSampleData();
        saveData();
      }
    } catch (e) {
      console.error('Error loading data from localStorage:', e);
      settings = { ...DEFAULT_SETTINGS };
      allData = {};
    }
  }

  // Create initial sample data
  function createInitialSampleData() {
    const today = getTodayISO();
    const initial = {};
    initial[today] = {
      water: 4,
      items: [
        {
          id: 'sample_1',
          name: 'Oatmeal with Blueberries & Honey',
          category: 'breakfast',
          calories: 340,
          protein: 11,
          carbs: 62,
          fat: 6,
          createdAt: Date.now() - 1000 * 60 * 60 * 6
        },
        {
          id: 'sample_2',
          name: 'Grilled Chicken Breast with Brown Rice',
          category: 'lunch',
          calories: 520,
          protein: 48,
          carbs: 55,
          fat: 9,
          createdAt: Date.now() - 1000 * 60 * 60 * 3
        },
        {
          id: 'sample_3',
          name: 'Greek Yogurt & Almonds',
          category: 'snacks',
          calories: 220,
          protein: 18,
          carbs: 12,
          fat: 11,
          createdAt: Date.now() - 1000 * 60 * 60 * 1
        }
      ]
    };
    return initial;
  }

  // Save to LocalStorage
  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(allData));
    } catch (e) {
      console.error('Failed to save log data:', e);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  // Ensure day entry exists
  function ensureDayEntry(dateStr) {
    if (!allData[dateStr]) {
      allData[dateStr] = {
        water: 0,
        items: []
      };
    }
    if (!Array.isArray(allData[dateStr].items)) {
      allData[dateStr].items = [];
    }
    if (typeof allData[dateStr].water !== 'number') {
      allData[dateStr].water = 0;
    }
    return allData[dateStr];
  }

  // Render Date Controls
  function renderDateControls() {
    activeDateInput.value = currentDate;
    const todayISO = getTodayISO();

    if (currentDate === todayISO) {
      dateLabel.textContent = 'Today';
      dateLabel.style.backgroundColor = '#ecfdf5';
      dateLabel.style.color = '#047857';
    } else {
      const dateObj = parseISODate(currentDate);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      dateLabel.textContent = dateObj.toLocaleDateString(undefined, options);
      dateLabel.style.backgroundColor = '#f1f5f9';
      dateLabel.style.color = '#475569';
    }
  }

  // Render Summary & Dashboard
  function renderSummary() {
    const day = ensureDayEntry(currentDate);
    const items = day.items;

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    items.forEach(function (item) {
      totalCalories += Number(item.calories) || 0;
      totalProtein += Number(item.protein) || 0;
      totalCarbs += Number(item.carbs) || 0;
      totalFat += Number(item.fat) || 0;
    });

    // Calories Card
    caloriesConsumedEl.textContent = totalCalories.toLocaleString();
    calorieTargetEl.textContent = settings.calorieGoal.toLocaleString();
    chartTargetIndicator.textContent = settings.calorieGoal.toLocaleString();

    const calPercent = settings.calorieGoal > 0 ? (totalCalories / settings.calorieGoal) * 100 : 0;
    const clampedCalPercent = Math.min(Math.max(calPercent, 0), 100);
    calorieProgressBar.style.width = clampedCalPercent + '%';

    const remaining = settings.calorieGoal - totalCalories;
    calorieStatusText.textContent = `Target: ${settings.calorieGoal.toLocaleString()} kcal`;

    if (remaining >= 0) {
      calorieRemainingText.textContent = `${remaining.toLocaleString()} kcal remaining`;
      calorieRemainingText.style.color = '#0f172a';
      calorieProgressBar.classList.remove('over-target');
    } else {
      const overBy = Math.abs(remaining);
      calorieRemainingText.textContent = `${overBy.toLocaleString()} kcal over target!`;
      calorieRemainingText.style.color = '#ef4444';
      calorieProgressBar.classList.add('over-target');
    }

    // Macros
    proteinConsumedEl.textContent = Math.round(totalProtein);
    proteinTargetEl.textContent = settings.proteinGoal;
    const pPercent = settings.proteinGoal > 0 ? Math.min((totalProtein / settings.proteinGoal) * 100, 100) : 0;
    proteinBarFill.style.width = pPercent + '%';

    carbsConsumedEl.textContent = Math.round(totalCarbs);
    carbsTargetEl.textContent = settings.carbsGoal;
    const cPercent = settings.carbsGoal > 0 ? Math.min((totalCarbs / settings.carbsGoal) * 100, 100) : 0;
    carbsBarFill.style.width = cPercent + '%';

    fatConsumedEl.textContent = Math.round(totalFat);
    fatTargetEl.textContent = settings.fatGoal;
    const fPercent = settings.fatGoal > 0 ? Math.min((totalFat / settings.fatGoal) * 100, 100) : 0;
    fatBarFill.style.width = fPercent + '%';

    // Water
    renderWater(day.water);
  }

  // Render Water Tracker
  function renderWater(waterCount) {
    waterCountEl.textContent = waterCount;
    waterCupsRow.innerHTML = '';

    const maxCups = 8;
    for (let i = 1; i <= maxCups; i++) {
      const cup = document.createElement('div');
      cup.className = 'water-cup-item' + (i <= waterCount ? ' filled' : '');
      cup.textContent = '💧';
      cup.title = `Cup ${i}`;
      cup.addEventListener('click', function () {
        const day = ensureDayEntry(currentDate);
        if (day.water === i) {
          day.water = i - 1;
        } else {
          day.water = i;
        }
        saveData();
        renderSummary();
      });
      waterCupsRow.appendChild(cup);
    }
  }

  // Render Meal Lists
  function renderMealLists() {
    const day = ensureDayEntry(currentDate);
    const items = day.items;

    // Reset lists and sums
    const mealTotals = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0
    };

    Object.keys(mealGroups).forEach(function (cat) {
      mealGroups[cat].list.innerHTML = '';
    });

    if (items.length === 0) {
      Object.keys(mealGroups).forEach(function (cat) {
        mealGroups[cat].list.innerHTML = `<div class="empty-state">No items logged for ${capitalize(cat)}.</div>`;
        mealGroups[cat].stats.textContent = '0 kcal';
      });
      return;
    }

    const counts = { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 };

    items.forEach(function (item) {
      const cat = item.category || 'snacks';
      if (!mealGroups[cat]) return;

      counts[cat]++;
      mealTotals[cat] += Number(item.calories) || 0;

      const row = document.createElement('div');
      row.className = 'meal-item-row';

      const left = document.createElement('div');
      left.className = 'item-left';

      const nameEl = document.createElement('span');
      nameEl.className = 'item-name';
      nameEl.textContent = item.name;
      left.appendChild(nameEl);

      const macrosTag = document.createElement('div');
      macrosTag.className = 'item-macros-tag';

      const pSpan = document.createElement('span');
      pSpan.className = 'macro-tag-p';
      pSpan.textContent = `P: ${item.protein || 0}g`;

      const cSpan = document.createElement('span');
      cSpan.className = 'macro-tag-c';
      cSpan.textContent = `C: ${item.carbs || 0}g`;

      const fSpan = document.createElement('span');
      fSpan.className = 'macro-tag-f';
      fSpan.textContent = `F: ${item.fat || 0}g`;

      macrosTag.appendChild(pSpan);
      macrosTag.appendChild(document.createTextNode('•'));
      macrosTag.appendChild(cSpan);
      macrosTag.appendChild(document.createTextNode('•'));
      macrosTag.appendChild(fSpan);

      left.appendChild(macrosTag);

      const right = document.createElement('div');
      right.className = 'item-right';

      const calEl = document.createElement('span');
      calEl.className = 'item-calories';
      calEl.textContent = `${Number(item.calories || 0).toLocaleString()} kcal`;

      const actions = document.createElement('div');
      actions.className = 'item-actions';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'icon-btn';
      editBtn.textContent = '✏️';
      editBtn.title = 'Edit item';
      editBtn.addEventListener('click', function () {
        openEditModal(item);
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'icon-btn delete-btn';
      delBtn.textContent = '🗑️';
      delBtn.title = 'Delete item';
      delBtn.addEventListener('click', function () {
        deleteItem(item.id);
      });

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      right.appendChild(calEl);
      right.appendChild(actions);

      row.appendChild(left);
      row.appendChild(right);

      mealGroups[cat].list.appendChild(row);
    });

    // Update stats and empty states for categories without items
    Object.keys(mealGroups).forEach(function (cat) {
      mealGroups[cat].stats.textContent = `${mealTotals[cat].toLocaleString()} kcal`;
      if (counts[cat] === 0) {
        mealGroups[cat].list.innerHTML = `<div class="empty-state">No items logged for ${capitalize(cat)}.</div>`;
      }
    });
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Delete Food Item
  function deleteItem(itemId) {
    const day = ensureDayEntry(currentDate);
    day.items = day.items.filter(function (item) {
      return item.id !== itemId;
    });
    saveData();
    renderAll();
  }

  // Edit Modal Handling
  function openEditModal(item) {
    editItemId.value = item.id;
    editFoodName.value = item.name;
    editMealCategory.value = item.category || 'breakfast';
    editCalories.value = item.calories;
    editProtein.value = item.protein || '';
    editCarbs.value = item.carbs || '';
    editFat.value = item.fat || '';

    editModal.classList.add('active');
  }

  function closeEditModal() {
    editModal.classList.remove('active');
  }

  editForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = editItemId.value;
    const day = ensureDayEntry(currentDate);
    const item = day.items.find(function (it) {
      return it.id === id;
    });

    if (item) {
      item.name = editFoodName.value.trim();
      item.category = editMealCategory.value;
      item.calories = parseFloat(editCalories.value) || 0;
      item.protein = parseFloat(editProtein.value) || 0;
      item.carbs = parseFloat(editCarbs.value) || 0;
      item.fat = parseFloat(editFat.value) || 0;

      saveData();
      closeEditModal();
      renderAll();
    }
  });

  closeEditBtn.addEventListener('click', closeEditModal);
  cancelEditBtn.addEventListener('click', closeEditModal);

  // Add Item Submit
  foodForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = foodNameInput.value.trim();
    const category = mealCategorySelect.value;
    const calories = parseFloat(foodCaloriesInput.value) || 0;
    const protein = parseFloat(foodProteinInput.value) || 0;
    const carbs = parseFloat(foodCarbsInput.value) || 0;
    const fat = parseFloat(foodFatInput.value) || 0;

    if (!name) return;

    const newItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      name: name,
      category: category,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      createdAt: Date.now()
    };

    const day = ensureDayEntry(currentDate);
    day.items.push(newItem);
    saveData();

    // Reset inputs
    foodNameInput.value = '';
    foodCaloriesInput.value = '';
    foodProteinInput.value = '';
    foodCarbsInput.value = '';
    foodFatInput.value = '';
    foodNameInput.focus();

    renderAll();
  });

  // Quick Preset Chips
  document.querySelectorAll('.preset-chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      foodNameInput.value = btn.dataset.name;
      foodCaloriesInput.value = btn.dataset.cal;
      foodProteinInput.value = btn.dataset.p;
      foodCarbsInput.value = btn.dataset.c;
      foodFatInput.value = btn.dataset.f;
    });
  });

  // Water buttons
  addWaterBtn.addEventListener('click', function () {
    const day = ensureDayEntry(currentDate);
    day.water = (day.water || 0) + 1;
    saveData();
    renderSummary();
  });

  resetWaterBtn.addEventListener('click', function () {
    const day = ensureDayEntry(currentDate);
    day.water = 0;
    saveData();
    renderSummary();
  });

  // Clear Day
  clearDayBtn.addEventListener('click', function () {
    if (confirm(`Are you sure you want to clear all logged food items for ${currentDate}?`)) {
      const day = ensureDayEntry(currentDate);
      day.items = [];
      saveData();
      renderAll();
    }
  });

  // Date Navigation Listeners
  prevDateBtn.addEventListener('click', function () {
    const dateObj = parseISODate(currentDate);
    dateObj.setDate(dateObj.getDate() - 1);
    currentDate = formatISO(dateObj);
    renderAll();
  });

  nextDateBtn.addEventListener('click', function () {
    const dateObj = parseISODate(currentDate);
    dateObj.setDate(dateObj.getDate() + 1);
    currentDate = formatISO(dateObj);
    renderAll();
  });

  todayBtn.addEventListener('click', function () {
    currentDate = getTodayISO();
    renderAll();
  });

  activeDateInput.addEventListener('change', function () {
    if (activeDateInput.value) {
      currentDate = activeDateInput.value;
      renderAll();
    }
  });

  // Settings Modal Handlers
  openSettingsBtn.addEventListener('click', function () {
    settingCalGoalInput.value = settings.calorieGoal;
    settingProteinGoalInput.value = settings.proteinGoal;
    settingCarbsGoalInput.value = settings.carbsGoal;
    settingFatGoalInput.value = settings.fatGoal;
    settingsModal.classList.add('active');
  });

  function closeSettingsModal() {
    settingsModal.classList.remove('active');
  }

  closeSettingsBtn.addEventListener('click', closeSettingsModal);
  cancelSettingsBtn.addEventListener('click', closeSettingsModal);

  settingsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    settings.calorieGoal = parseInt(settingCalGoalInput.value, 10) || DEFAULT_SETTINGS.calorieGoal;
    settings.proteinGoal = parseInt(settingProteinGoalInput.value, 10) || DEFAULT_SETTINGS.proteinGoal;
    settings.carbsGoal = parseInt(settingCarbsGoalInput.value, 10) || DEFAULT_SETTINGS.carbsGoal;
    settings.fatGoal = parseInt(settingFatGoalInput.value, 10) || DEFAULT_SETTINGS.fatGoal;

    saveSettings();
    closeSettingsModal();
    renderAll();
  });

  // Export JSON
  exportBtn.addEventListener('click', function () {
    const exportPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: settings,
      data: allData
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nutritrack-backup-${getTodayISO()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Import JSON
  importFileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported && imported.data) {
          if (imported.settings) {
            settings = Object.assign({}, DEFAULT_SETTINGS, imported.settings);
            saveSettings();
          }
          allData = Object.assign({}, allData, imported.data);
          saveData();
          alert('Data imported successfully!');
          closeSettingsModal();
          renderAll();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // Wipe Data
  wipeAllDataBtn.addEventListener('click', function () {
    if (confirm('Warning: This will permanently delete ALL your logged nutrition entries and reset settings. Continue?')) {
      localStorage.removeItem(STORAGE_KEY_DATA);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      settings = { ...DEFAULT_SETTINGS };
      allData = {};
      ensureDayEntry(currentDate);
      saveData();
      saveSettings();
      closeSettingsModal();
      renderAll();
      alert('All data has been reset.');
    }
  });

  // Draw 7-Day History Chart on Canvas (Vanilla Canvas 2D)
  function renderChart() {
    if (!weeklyChartCanvas || !weeklyChartCanvas.getContext) return;
    const ctx = weeklyChartCanvas.getContext('2d');

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = weeklyChartCanvas.getBoundingClientRect();
    const width = rect.width > 0 ? rect.width : 700;
    const height = 240;

    weeklyChartCanvas.width = width * dpr;
    weeklyChartCanvas.height = height * dpr;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // Calculate last 7 days ending at selected currentDate
    const centerDate = parseISODate(currentDate);
    const dayList = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(centerDate);
      d.setDate(d.getDate() - i);
      const iso = formatISO(d);
      const dayData = allData[iso] || { items: [] };
      let cals = 0;
      (dayData.items || []).forEach(function (item) {
        cals += Number(item.calories) || 0;
      });
      dayList.push({
        iso: iso,
        dateObj: d,
        calories: cals,
        isSelected: iso === currentDate
      });
    }

    // Chart dimensions
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;
    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    // Max scale calculation
    const maxValFound = Math.max(...dayList.map(d => d.calories), settings.calorieGoal);
    const yMax = Math.ceil((maxValFound * 1.15) / 500) * 500 || 2500;

    // Draw horizontal grid lines & Y labels
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#e2e8f0';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';

    const steps = 4;
    for (let s = 0; s <= steps; s++) {
      const val = Math.round((yMax / steps) * s);
      const y = paddingTop + chartH - (s / steps) * chartH;

      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      ctx.fillText(val.toLocaleString(), paddingLeft - 8, y + 4);
    }

    // Draw Target Goal Line
    if (settings.calorieGoal <= yMax) {
      const goalY = paddingTop + chartH - (settings.calorieGoal / yMax) * chartH;
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, goalY);
      ctx.lineTo(width - paddingRight, goalY);
      ctx.stroke();

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('Target', width - paddingRight, goalY - 4);
      ctx.restore();
    }

    // Draw Bars
    const numBars = dayList.length;
    const slotW = chartW / numBars;
    const barW = Math.min(Math.max(slotW * 0.55, 24), 54);

    dayList.forEach(function (d, idx) {
      const xCenter = paddingLeft + idx * slotW + slotW / 2;
      const barX = xCenter - barW / 2;
      const barHeight = (d.calories / yMax) * chartH;
      const barY = paddingTop + chartH - barHeight;

      // Color scheme
      let barColor = '#10b981'; // green within goal
      if (d.calories > settings.calorieGoal) {
        barColor = '#ef4444'; // red if over
      } else if (d.calories === 0) {
        barColor = '#cbd5e1'; // neutral empty
      }

      // Bar body
      ctx.fillStyle = barColor;
      roundRect(ctx, barX, barY, barW, Math.max(barHeight, 2), 6, true, false);

      // Selected ring / border
      if (d.isSelected) {
        ctx.save();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#0f172a';
        roundRect(ctx, barX - 2, barY - 2, barW + 4, Math.max(barHeight + 4, 6), 8, false, true);
        ctx.restore();
      }

      // Value label on top of bar
      if (d.calories > 0) {
        ctx.fillStyle = d.calories > settings.calorieGoal ? '#dc2626' : '#1e293b';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.calories.toLocaleString(), xCenter, barY - 6);
      }

      // X-axis label (Day name + date)
      ctx.fillStyle = d.isSelected ? '#0f172a' : '#64748b';
      ctx.font = d.isSelected ? 'bold 11px sans-serif' : '11px sans-serif';
      ctx.textAlign = 'center';

      const dayName = d.dateObj.toLocaleDateString(undefined, { weekday: 'short' });
      const dayNum = d.dateObj.getDate();
      ctx.fillText(`${dayName} ${dayNum}`, xCenter, height - 14);
    });
  }

  // Canvas helper for rounded rectangles
  function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === 'undefined') radius = 5;
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    }
    // Don't round bottom corners for chart bars
    radius.br = 0;
    radius.bl = 0;

    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

  // Handle window resize for canvas redrawing
  window.addEventListener('resize', function () {
    renderChart();
  });

  // Master Render
  function renderAll() {
    renderDateControls();
    renderSummary();
    renderMealLists();
    renderChart();
  }

  // Initialization
  loadData();
  renderAll();

})();

