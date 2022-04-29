<?php
namespace Coercive\Utility\CookieConsent;

/**
 * Management of user consent regarding the use of cookies.
 *
 * @package Coercive\Utility\CookieConsent
 * @link https://github.com/Coercive/CookieConsent
 *
 * @author Anthony Moral <contact@coercive.fr>
 * @copyright 2022
 * @license MIT
 */
class CookieConsent
{
	const DEFAULT_COOKIE_NAME = 'cookieconsent';

	const CONSENT_ALL = 'ALL';
	const CONSENT_NONE = 'NONE';

	/** @var bool user consent not setted */
	private bool $exist;

	/** @var bool user consent all */
	private bool $all;

	/** @var bool user consent nothing */
	private bool $none;

	/** @var array list of user consents */
	private array $consents = [];

	/**
	 * CookieConsent construct.
	 *
	 * @param string $name [optional]
	 * @param string $separator [optional]
	 * @return void
	 */
	final public function __construct(string $name = self::DEFAULT_COOKIE_NAME, string $separator = ';')
	{
		$str = strval($_COOKIE[$name] ?? '');
		$this->exist = !!$str;
		$this->all = $str === self::CONSENT_ALL;
		$this->none = !$str || $str === self::CONSENT_NONE;
		if(!$this->all && !$this->none) {
			$consents = explode($separator, $str);
			foreach ($consents as $id) {
				if($id = trim($id)) {
					$this->consents[$id] = true;
				}
			}
		}
	}

	/**
	 * @return bool
	 */
	final public function exist(): bool
	{
		return $this->exist;
	}

	/**
	 * @return bool
	 */
	final public function all(): bool
	{
		return $this->all;
	}

	/**
	 * @return bool
	 */
	final public function none(): bool
	{
		return $this->none;
	}

	/**
	 * @param string $id
	 * @return bool
	 */
	final public function is(string $id): bool
	{
		return $this->all() || array_key_exists($id, $this->consents);
	}
}