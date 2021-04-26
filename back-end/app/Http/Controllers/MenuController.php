<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Category;
use App\TopCategory;
use App\Item;
use App\Location;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $menu = TopCategory::with(['categories.items' => function ($query) {
            $query->where('visible', true)->orderBy('name');
        }, 'categories.items.optionGroups'])->get();

        $custom_id = Item::where('name', 'Custom Item')->first()->id;
        $mod_id = Item::where('name', 'Kitchen Mod')->first()->id;

        return response()->json([
          'menu' => $menu,
          'custom_id' => $custom_id,
          'mod_id' => $mod_id
        ]);
    }

    public function addMenuItem(Request $request) {
        $category = Category::with('topCategory')->findOrFail($request->input('category_id'));

        $menuItem = new Item;
        $menuItem->name = $request->input('name');
        $menuItem->price = (int)($request->input('price') * 100);
        $menuItem->to_kitchen = $request->input('to_kitchen') || false;
        $menuItem->category()->associate($category);
        $menuItem->saveOrFail();

        return response(null, 200);
    }

    public function addCategory(Request $request) {
        $category;

        $topCategoryId = $request->input('top_category_id');
        if (filled($topCategoryId)) {
            $category = Category::findOrNew($request->input('id'));
            $topCategory = TopCategory::findOrFail($request->input('top_category_id'));
            $category->topCategory()->associate($topCategory);
        } else {
            $category = TopCategory::findOrNew($request->input('id'));
        }

        $category->name = $request->input('name');
        $category->saveOrFail();

        return response(null, 200);
    }

    public function editMenuItem($item_id, Request $request) {
        $menuItem = Item::findOrFail($item_id);

        if ($request->input('name')) {
            $menuItem->name = $request->input('name');
        }
        if ($request->input('price')) {
            $menuItem->price = (int)(round($request->input('price') * 100));
        }

        $catId = $request->input('category_id');
        if (isset($catId) && $catId != $menuItem->category_id) {
            $category = Category::findOrFail($catId);
            $menuItem->category()->associate($category);
        }

        $toKitchen = $request->input('to_kitchen');
        if ($toKitchen !== null) {
            $menuItem->to_kitchen = $toKitchen;
        }

        $menuItem->saveOrFail();

        return response(null, 200);
    }

    public function removeMenuItem($item_id) {
        $menuItem = Item::withCount('orders')->with(['orders.seat.table' => function ($query) {
            $query->has('location')->with('location');
        }])->findOrFail($item_id);

        $on_tables = [];
        foreach ($menuItem->orders as $order) {
            if (isset($order->seat->table)) {
                array_push($on_tables, $order->seat->table->location->number);
            }
        }

        $num_on_tables = count($on_tables);
        if ($num_on_tables > 0) {
            $plural = $num_on_tables > 1 ? 's' : '';

            return response()->json([
                'message' => 'Cannot delete "' . $menuItem->name . '"' .
                '; item is currently on table' . $plural .
                ' ' . implode($on_tables, ', ') . '.'
            ], 400);
        }

        $menuItem->delete();

        return response(null, 200);
    }

    public function removeTopCategory($category_id) {
        TopCategory::destroy($category_id);
        return response(null, 200);
    }

    public function removeSubcategory($category_id) {
        Category::destroy($category_id);
        return response(null, 200);
    }
}
