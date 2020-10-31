/**
 * File: JsExporter.cs
 * Eco Version: 8.2.8
 * JsExporter Version: 1.1
 * 
 * Author: koka
 * 
 * 
 * Exports recipes to use in javascript
 * 
 */

using System;
using System.Globalization;
using System.IO;
using System.Linq;
using Eco.Core.Plugins.Interfaces;
using Eco.Gameplay.Components;
using Eco.Gameplay.DynamicValues;
using Eco.Gameplay.Items;
using Eco.Gameplay.Objects;
using Eco.Shared;
using Eco.Shared.Localization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace JsExporter
{
    public class JsExporter : IModKitPlugin
    {
        private string _usedSkill;

        public JsExporter()
        {
            JToken result = new JObject();
            result["Version"] = EcoVersion.Version;
            result["Localization"] = new JObject();

            foreach (SupportedLanguage language in Enum.GetValues(typeof(SupportedLanguage)))
            {
                if (!Localizer.IsNormalizedLanguage(language))
                    continue;

                Localizer.TrySetLanguage(language);
                JObject localization = new JObject();
                result["Localization"][language.GetLocDisplayName()] = localization;

                foreach (Item item in Item.AllItems)
                {
                    localization[item.Type.Name] = (string)item.DisplayName;
                }

                foreach (Recipe recipe in Recipe.AllRecipes)
                {
                    localization[recipe.GetType().Name] = (string)recipe.DisplayName;
                }
            }

            JObject recipes = new JObject();
            result["Recipes"] = recipes;
            foreach (Recipe recipe in Recipe.AllRecipes)
            {
                recipes[recipe.GetType().Name] = ProcessRecipeType(recipe);
            }

            using (TextWriter textWriter = new StreamWriter("config.json"))
            using (JsonWriter jsonWriter = new JsonTextWriter(textWriter))
            {
                result.WriteTo(jsonWriter);
            }
        }

        /// <inheritdoc />
        public string GetStatus()
        {
            return "Idle.";
        }

        /// <inheritdoc />
        public override string ToString()
        {
            return nameof(JsExporter);
        }

        /// <summary>
        /// Checks recipe
        /// </summary>
        private JToken ProcessRecipeType(Recipe recipe)
        {
            JObject result = new JObject();

            _usedSkill = null;
            bool first = true;
            Logger.Assert(recipe.Products.Length > 0, "Products array should be not empty");
            foreach (var craftingElement in recipe.Products)
            {
                string name = craftingElement.Item.Type.Name;
                if (first)
                {
                    first = false;
                    result["result"] = name;
                    result["quantity"] = EvaluateDynamicValue(craftingElement.Quantity);
                    result["ingredients"] = new JObject();
                    continue;
                }

                result["ingredients"][name] = EvaluateDynamicValue(craftingElement.Quantity);
            }

            foreach (var craftingElement in recipe.Ingredients)
            {
                string name = craftingElement.Item.Type.Name;
                result["ingredients"][name] = EvaluateDynamicValue(craftingElement.Quantity);
            }

            if (_usedSkill != null)
            {
                result["skill"] = _usedSkill;
            }

            foreach (var tableType in CraftingComponent.TablesForRecipe(typeof(Recipe)))
            {
                Logger.Assert(tableType.IsSubclassOf(typeof(WorldObject)), $"{tableType} is not a world object");
                foreach (RequireComponentAttribute attribute in tableType.GetCustomAttributes(typeof(RequireComponentAttribute), true))
                {
                    
                }
            }


            return result;
        }

        /// <summary>
        /// Converts Eco dynamic value to js
        /// </summary>
        private string EvaluateDynamicValue(IDynamicValue value)
        {
            if (value is ConstantValue)
            {
                return value.GetBaseValue.ToString(CultureInfo.InvariantCulture);
            }

            if (value is MultiDynamicValue multiValue)
            {
                string parameters = string.Join(",", multiValue.Values.Select(EvaluateDynamicValue));
                return $"Operation_{multiValue.Op}({parameters})";
            }

            if (value is SkillModifiedValue skillValue)
            {
                string values = string.Join(",", skillValue.Values.Select(floatValue => floatValue.ToString(CultureInfo.InvariantCulture)));
                _usedSkill = skillValue.SkillType.Name;
                return $"[{values}][skills[\"{skillValue.SkillType.Name}\"]]";
            }

            if (value is TalentModifiedValue talentValue)
            {
                return $"talents[\"{talentValue.TalentType.Name}\"] ? {talentValue.Talent.Value.ToString(CultureInfo.InvariantCulture)} : {talentValue.BaseValue.ToString(CultureInfo.InvariantCulture)}";
            }

            throw new Exception($"Can't evaluate value {value}");
        }
    }
}
