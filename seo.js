window.site_master_metric_seo = {
	run: function() {
		var results = [];

		results = results.concat(
			this.testTitleTag(),
			this.testMetaDescription(),
			this.testHeadings(),
			this.testMetaKeywords()
		);
		
		return results;
	},
	
	testTitleTag: function() {
		//it should exist and be shorter than 60 characters
		var results = [];

		var selector = 'head title';
		var title = document.querySelector(selector);
		
		var mark_title_exists = this.createMark('title_exists', 'A title element should exist on the page', null, selector);
		mark_title_exists.description = 'Search engines will use the title tag as one of the most important factors of SEO and also display it to users.';
		var mark_title_length = this.createMark('title_length', 'The title element should not exceed 60 characters', null, selector);
		mark_title_length.description = 'Search engines will only show up to 60 characters of the title tag to users, so it should be kept under that limit.';

		
		if (!title) {
			//No title element
			mark_title_exists.passes = false;
			mark_title_length.passes = false;
			mark_title_length.value_found = 'title does not exist';
		} else {
			//A title element was found
			mark_title_exists.passes = true;
			mark_title_exists.value_found = title.textContent;
			mark_title_exists.context = title.outerHTML;
			
			var length = title.textContent.length;
			mark_title_length.value_found = length + ' characters: ' + title.textContent;
			mark_title_length.context = title.outerHTML;
			
			if (length > 60) {
				//longer than 60 characters
				mark_title_length.passes = false;
			} else {
				mark_title_length.passes = true;
			}
		}

		results.push(mark_title_exists);
		results.push(mark_title_length);
		
		return results;
	},
	
	testMetaDescription: function()
	{
		//it should exist and be shorter than 150 characters
		var results = [];

		var selector = 'head meta[name="description"]';
		
		var mark_description_exists = this.createMark('description_exists', 'The meta description should exist', null, selector);
		mark_description_exists.description = 'Search engines will use the meta description tag as a summary of the page to show to users.';
		var mark_description_length = this.createMark('long_description', 'The meta description should not exceed 160 characters', null, selector);
		mark_description_length.description = 'Search engines will usually not display more than 160 characters of the meta description tag, so it should be kept under that limit.';
		
		var description = document.querySelector(selector);
		
		if (!description) {
			mark_description_exists.passes = false;
			mark_description_length.passes = false;
			mark_description_length.value_found = 'meta description does not exist';
		} else {
			//description was found
			mark_description_exists.passes = true;
			mark_description_exists.value_found = description.getAttribute('content');
			mark_description_exists.context = description.outerHTML;
			
			var length = description.getAttribute('content').length;
			mark_description_length.value_found = length + ' characters: ' + description.getAttribute('content');
			mark_description_length.context = description.outerHTML;
			
			if (length > 160) {
				mark_description_length.passes = false;
			} else {
				mark_description_length.passes = true;
			}
		}

		results.push(mark_description_exists);
		results.push(mark_description_length);
		
		return results;
	},
	
	testHeadings: function() {
		//There should be heading elements on the page
		var results = [];

		var selector = 'h1, h2, h3, h4, h5, h6';

		var mark_headings_exist = this.createMark('headings_exist', 'Heading elements should exist', null, selector);
		mark_headings_exist.description = 'Heading tags can be used by search engines to generate a list of key words for the page.';

		var headings = document.querySelectorAll(selector);
		
		if (headings.length == 0) {
			mark_headings_exist.passes = false;
			mark_headings_exist.value_found = 'no heading elements were found';
		} else {
			mark_headings_exist.passes = true;
		}

		results.push(mark_headings_exist);
		
		return results;
	},
	
	testMetaKeywords: function() {
		//Keywords should not exist because they are not helpful
		var results = [];

		var selector = 'head meta[name="keywords"]';

		var mark_keywords_not_exist = this.createMark('meta_keywords_not_exist', 'Meta keywords should not exist', null, selector);
		mark_keywords_not_exist.description = 'The meta keywords tag is not used by any search engines and will not improve your SEO score. They should be avoided.';

		var keywords = document.querySelector(selector);

		if (keywords) {
			mark_keywords_not_exist.passes = false;
			mark_keywords_not_exist.value_found = 'The selector - '+ selector+' - matched elements on the page';
			mark_keywords_not_exist.context = keywords.outerHTML;
		} else {
			mark_keywords_not_exist.passes = true;
		}
		
		results.push(mark_keywords_not_exist);

		return results;
	},
	
	createMark: function(id, name, value_found, selector) {
		return {
			'id' : id,
			'name': name,
			'description': '',
			'value_found': value_found,
			'context': '',
			'selector': selector,
			'passes': null
		}
	}
};
