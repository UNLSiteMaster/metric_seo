<?php
namespace SiteMaster\Plugins\Metric_seo;

use HtmlValidator\Validator;
use SiteMaster\Core\Auditor\Logger\Metrics;
use SiteMaster\Core\Auditor\MetricInterface;
use SiteMaster\Core\Registry\Site;
use SiteMaster\Core\Auditor\Scan;
use SiteMaster\Core\Auditor\Site\Page;
use SiteMaster\Core\RuntimeException;

class Metric extends MetricInterface
{
    /**
     * @param string $plugin_name
     * @param array $options
     */
    public function __construct($plugin_name, array $options = array())
    {
        $options = array_replace_recursive(array(
            'service_url' => 'https://validator.w3.org/nu/',
            'help_text' => array()
        ), $options);

        parent::__construct($plugin_name, $options);
    }

    /**
     * Get the human readable name of this metric
     *
     * @return string The human readable name of the metric
     */
    public function getName()
    {
        return 'SEO';
    }

    /**
     * Get the Machine name of this metric
     *
     * This is what defines this metric in the database
     *
     * @return string The unique string name of this metric
     */
    public function getMachineName()
    {
        return 'metric_seo';
    }

    /**
     * Determine if this metric should be graded as pass-fail
     *
     * @return bool True if pass-fail, False if normally graded
     */
    public function isPassFail()
    {
        if (isset($this->options['pass_fail']) && $this->options['pass_fail'] == true) {
            //Simulate a pass/fail metric grade
            return true;
        }

        return false;
    }

    /**
     * Scan a given URI and apply all marks to it.
     *
     * All that this
     *
     * @param string $uri The uri to scan
     * @param \DOMXPath $xpath The xpath of the uri
     * @param int $depth The current depth of the scan
     * @param \SiteMaster\Core\Auditor\Site\Page $page The current page to scan
     * @param \SiteMaster\Core\Auditor\Logger\Metrics $context The logger class which calls this method, you can access the spider, page, and scan from this
     * @throws \Exception
     * @return bool True if there was a successful scan, false if not.  If false, the metric will be graded as incomplete
     */
    public function scan($uri, \DOMXPath $xpath, $depth, Page $page, Metrics $context)
    {
        if (false === $this->headless_results || isset($this->headless_results['exception'])) {
            //mark this metric as incomplete
            throw new RuntimeException('headless results are required for the seo metric');
        }
        
        foreach ($this->headless_results as $result) {
            $point_deduction = 1;
            if ($result['passes']) {
                $point_deduction = -1;
            }

            $machine_name = 'seo_'.$result['id'].'_'.(($result['passes'])? 'pass': 'fail');

            $mark = $this->getMark($machine_name, $result['name'], $point_deduction, $result['description']);

            /**
             * TODO: do the following
             * 1. check for a sitemap file
             */
            $page->addMark($mark, array(
                'context'   => htmlentities($result['context']),
                'value_found' => htmlentities($result['value_found']),
            ));
        }
        
        $site = $page->getSite();
        
        if ($uri === $site->base_url) {
            $sitemap_url = $site->base_url . 'sitemap.xml';
            //If this is the base url (home page), check for a sitemap
            $info = \SiteMaster\Core\Util::getHTTPInfo($sitemap_url);
            
            $point_deduction = -1;
            if (!$info['okay']) {
                //Could not be found, or there is some sort of error
                $point_deduction = 1;
            }

            $mark = $this->getMark('seo_sitemap', 'A sitemap should exist', $point_deduction, 'A sitemap.xml file helps search engines know about pages on your site that might not otherwise be discovered.', 'See more information on the [sitemap protocol](https://www.sitemaps.org/protocol.html).');
            $page->addMark($mark, array(
                'help_text' => 'The file should exist at [' . $sitemap_url . '](' . $sitemap_url . ').',
            ));
        }

        return true;
    }
    

    /**
     * Get the help text for a mark by machine_name
     *
     * @param string $machine_name
     * @return null|string
     */
    public function getHelpText($machine_name)
    {
        if (isset($this->options['help_text'][$machine_name])) {
            return $this->options['help_text'][$machine_name];
        }

        return null;
    }
}
