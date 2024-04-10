class A extends Error { }
/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
function t(A) {
    let t = A.length;
    for (; --t >= 0;) A[t] = 0
}
const e = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]),
    i = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]),
    s = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]),
    a = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
    n = new Array(576);
t(n);
const r = new Array(60);
t(r);
const h = new Array(512);
t(h);
const g = new Array(256);
t(g);
const o = new Array(29);
t(o);
const E = new Array(30);

function _(A, t, e, i, s) {
    this.static_tree = A, this.extra_bits = t, this.extra_base = e, this.elems = i, this.max_length = s, this.has_stree = A && A.length
}
let w, B, I;

function c(A, t) {
    this.dyn_tree = A, this.max_code = 0, this.stat_desc = t
}
t(E);
const C = A => A < 256 ? h[A] : h[256 + (A >>> 7)],
    l = (A, t) => {
        A.pending_buf[A.pending++] = 255 & t, A.pending_buf[A.pending++] = t >>> 8 & 255
    },
    d = (A, t, e) => {
        A.bi_valid > 16 - e ? (A.bi_buf |= t << A.bi_valid & 65535, l(A, A.bi_buf), A.bi_buf = t >> 16 - A.bi_valid, A.bi_valid += e - 16) : (A.bi_buf |= t << A.bi_valid & 65535, A.bi_valid += e)
    },
    Q = (A, t, e) => {
        d(A, e[2 * t], e[2 * t + 1])
    },
    f = (A, t) => {
        let e = 0;
        do {
            e |= 1 & A, A >>>= 1, e <<= 1
        } while (--t > 0);
        return e >>> 1
    },
    D = (A, t, e) => {
        const i = new Array(16);
        let s, a, n = 0;
        for (s = 1; s <= 15; s++) n = n + e[s - 1] << 1, i[s] = n;
        for (a = 0; a <= t; a++) {
            let t = A[2 * a + 1];
            0 !== t && (A[2 * a] = f(i[t]++, t))
        }
    },
    M = A => {
        let t;
        for (t = 0; t < 286; t++) A.dyn_ltree[2 * t] = 0;
        for (t = 0; t < 30; t++) A.dyn_dtree[2 * t] = 0;
        for (t = 0; t < 19; t++) A.bl_tree[2 * t] = 0;
        A.dyn_ltree[512] = 1, A.opt_len = A.static_len = 0, A.sym_next = A.matches = 0
    },
    S = A => {
        A.bi_valid > 8 ? l(A, A.bi_buf) : A.bi_valid > 0 && (A.pending_buf[A.pending++] = A.bi_buf), A.bi_buf = 0, A.bi_valid = 0
    },
    R = (A, t, e, i) => {
        const s = 2 * t,
            a = 2 * e;
        return A[s] < A[a] || A[s] === A[a] && i[t] <= i[e]
    },
    u = (A, t, e) => {
        const i = A.heap[e];
        let s = e << 1;
        for (; s <= A.heap_len && (s < A.heap_len && R(t, A.heap[s + 1], A.heap[s], A.depth) && s++, !R(t, i, A.heap[s], A.depth));) A.heap[e] = A.heap[s], e = s, s <<= 1;
        A.heap[e] = i
    },
    p = (A, t, s) => {
        let a, n, r, h, _ = 0;
        if (0 !== A.sym_next)
            do {
                a = 255 & A.pending_buf[A.sym_buf + _++], a += (255 & A.pending_buf[A.sym_buf + _++]) << 8, n = A.pending_buf[A.sym_buf + _++], 0 === a ? Q(A, n, t) : (r = g[n], Q(A, r + 256 + 1, t), h = e[r], 0 !== h && (n -= o[r], d(A, n, h)), a--, r = C(a), Q(A, r, s), h = i[r], 0 !== h && (a -= E[r], d(A, a, h)))
            } while (_ < A.sym_next);
        Q(A, 256, t)
    },
    y = (A, t) => {
        const e = t.dyn_tree,
            i = t.stat_desc.static_tree,
            s = t.stat_desc.has_stree,
            a = t.stat_desc.elems;
        let n, r, h, g = -1;
        for (A.heap_len = 0, A.heap_max = 573, n = 0; n < a; n++) 0 !== e[2 * n] ? (A.heap[++A.heap_len] = g = n, A.depth[n] = 0) : e[2 * n + 1] = 0;
        for (; A.heap_len < 2;) h = A.heap[++A.heap_len] = g < 2 ? ++g : 0, e[2 * h] = 1, A.depth[h] = 0, A.opt_len--, s && (A.static_len -= i[2 * h + 1]);
        for (t.max_code = g, n = A.heap_len >> 1; n >= 1; n--) u(A, e, n);
        h = a;
        do {
            n = A.heap[1], A.heap[1] = A.heap[A.heap_len--], u(A, e, 1), r = A.heap[1], A.heap[--A.heap_max] = n, A.heap[--A.heap_max] = r, e[2 * h] = e[2 * n] + e[2 * r], A.depth[h] = (A.depth[n] >= A.depth[r] ? A.depth[n] : A.depth[r]) + 1, e[2 * n + 1] = e[2 * r + 1] = h, A.heap[1] = h++, u(A, e, 1)
        } while (A.heap_len >= 2);
        A.heap[--A.heap_max] = A.heap[1], ((A, t) => {
            const e = t.dyn_tree,
                i = t.max_code,
                s = t.stat_desc.static_tree,
                a = t.stat_desc.has_stree,
                n = t.stat_desc.extra_bits,
                r = t.stat_desc.extra_base,
                h = t.stat_desc.max_length;
            let g, o, E, _, w, B, I = 0;
            for (_ = 0; _ <= 15; _++) A.bl_count[_] = 0;
            for (e[2 * A.heap[A.heap_max] + 1] = 0, g = A.heap_max + 1; g < 573; g++) o = A.heap[g], _ = e[2 * e[2 * o + 1] + 1] + 1, _ > h && (_ = h, I++), e[2 * o + 1] = _, o > i || (A.bl_count[_]++, w = 0, o >= r && (w = n[o - r]), B = e[2 * o], A.opt_len += B * (_ + w), a && (A.static_len += B * (s[2 * o + 1] + w)));
            if (0 !== I) {
                do {
                    for (_ = h - 1; 0 === A.bl_count[_];) _--;
                    A.bl_count[_]--, A.bl_count[_ + 1] += 2, A.bl_count[h]--, I -= 2
                } while (I > 0);
                for (_ = h; 0 !== _; _--)
                    for (o = A.bl_count[_]; 0 !== o;) E = A.heap[--g], E > i || (e[2 * E + 1] !== _ && (A.opt_len += (_ - e[2 * E + 1]) * e[2 * E], e[2 * E + 1] = _), o--)
            }
        })(A, t), D(e, g, A.bl_count)
    },
    m = (A, t, e) => {
        let i, s, a = -1,
            n = t[1],
            r = 0,
            h = 7,
            g = 4;
        for (0 === n && (h = 138, g = 3), t[2 * (e + 1) + 1] = 65535, i = 0; i <= e; i++) s = n, n = t[2 * (i + 1) + 1], ++r < h && s === n || (r < g ? A.bl_tree[2 * s] += r : 0 !== s ? (s !== a && A.bl_tree[2 * s]++, A.bl_tree[32]++) : r <= 10 ? A.bl_tree[34]++ : A.bl_tree[36]++, r = 0, a = s, 0 === n ? (h = 138, g = 3) : s === n ? (h = 6, g = 3) : (h = 7, g = 4))
    },
    k = (A, t, e) => {
        let i, s, a = -1,
            n = t[1],
            r = 0,
            h = 7,
            g = 4;
        for (0 === n && (h = 138, g = 3), i = 0; i <= e; i++)
            if (s = n, n = t[2 * (i + 1) + 1], !(++r < h && s === n)) {
                if (r < g)
                    do {
                        Q(A, s, A.bl_tree)
                    } while (0 != --r);
                else 0 !== s ? (s !== a && (Q(A, s, A.bl_tree), r--), Q(A, 16, A.bl_tree), d(A, r - 3, 2)) : r <= 10 ? (Q(A, 17, A.bl_tree), d(A, r - 3, 3)) : (Q(A, 18, A.bl_tree), d(A, r - 11, 7));
                r = 0, a = s, 0 === n ? (h = 138, g = 3) : s === n ? (h = 6, g = 3) : (h = 7, g = 4)
            }
    };
let F = !1;
const b = (A, t, e, i) => {
    d(A, 0 + (i ? 1 : 0), 3), S(A), l(A, e), l(A, ~e), e && A.pending_buf.set(A.window.subarray(t, t + e), A.pending), A.pending += e
};
var H = (A, t, e, i) => {
    let s, h, g = 0;
    A.level > 0 ? (2 === A.strm.data_type && (A.strm.data_type = (A => {
        let t, e = 4093624447;
        for (t = 0; t <= 31; t++, e >>>= 1)
            if (1 & e && 0 !== A.dyn_ltree[2 * t]) return 0;
        if (0 !== A.dyn_ltree[18] || 0 !== A.dyn_ltree[20] || 0 !== A.dyn_ltree[26]) return 1;
        for (t = 32; t < 256; t++)
            if (0 !== A.dyn_ltree[2 * t]) return 1;
        return 0
    })(A)), y(A, A.l_desc), y(A, A.d_desc), g = (A => {
        let t;
        for (m(A, A.dyn_ltree, A.l_desc.max_code), m(A, A.dyn_dtree, A.d_desc.max_code), y(A, A.bl_desc), t = 18; t >= 3 && 0 === A.bl_tree[2 * a[t] + 1]; t--);
        return A.opt_len += 3 * (t + 1) + 5 + 5 + 4, t
    })(A), s = A.opt_len + 3 + 7 >>> 3, h = A.static_len + 3 + 7 >>> 3, h <= s && (s = h)) : s = h = e + 5, e + 4 <= s && -1 !== t ? b(A, t, e, i) : 4 === A.strategy || h === s ? (d(A, 2 + (i ? 1 : 0), 3), p(A, n, r)) : (d(A, 4 + (i ? 1 : 0), 3), ((A, t, e, i) => {
        let s;
        for (d(A, t - 257, 5), d(A, e - 1, 5), d(A, i - 4, 4), s = 0; s < i; s++) d(A, A.bl_tree[2 * a[s] + 1], 3);
        k(A, A.dyn_ltree, t - 1), k(A, A.dyn_dtree, e - 1)
    })(A, A.l_desc.max_code + 1, A.d_desc.max_code + 1, g + 1), p(A, A.dyn_ltree, A.dyn_dtree)), M(A), i && S(A)
},
    G = {
        _tr_init: A => {
            F || ((() => {
                let A, t, a, c, C;
                const l = new Array(16);
                for (a = 0, c = 0; c < 28; c++)
                    for (o[c] = a, A = 0; A < 1 << e[c]; A++) g[a++] = c;
                for (g[a - 1] = c, C = 0, c = 0; c < 16; c++)
                    for (E[c] = C, A = 0; A < 1 << i[c]; A++) h[C++] = c;
                for (C >>= 7; c < 30; c++)
                    for (E[c] = C << 7, A = 0; A < 1 << i[c] - 7; A++) h[256 + C++] = c;
                for (t = 0; t <= 15; t++) l[t] = 0;
                for (A = 0; A <= 143;) n[2 * A + 1] = 8, A++, l[8]++;
                for (; A <= 255;) n[2 * A + 1] = 9, A++, l[9]++;
                for (; A <= 279;) n[2 * A + 1] = 7, A++, l[7]++;
                for (; A <= 287;) n[2 * A + 1] = 8, A++, l[8]++;
                for (D(n, 287, l), A = 0; A < 30; A++) r[2 * A + 1] = 5, r[2 * A] = f(A, 5);
                w = new _(n, e, 257, 286, 15), B = new _(r, i, 0, 30, 15), I = new _(new Array(0), s, 0, 19, 7)
            })(), F = !0), A.l_desc = new c(A.dyn_ltree, w), A.d_desc = new c(A.dyn_dtree, B), A.bl_desc = new c(A.bl_tree, I), A.bi_buf = 0, A.bi_valid = 0, M(A)
        },
        _tr_stored_block: b,
        _tr_flush_block: H,
        _tr_tally: (A, t, e) => (A.pending_buf[A.sym_buf + A.sym_next++] = t, A.pending_buf[A.sym_buf + A.sym_next++] = t >> 8, A.pending_buf[A.sym_buf + A.sym_next++] = e, 0 === t ? A.dyn_ltree[2 * e]++ : (A.matches++, t--, A.dyn_ltree[2 * (g[e] + 256 + 1)]++, A.dyn_dtree[2 * C(t)]++), A.sym_next === A.sym_end),
        _tr_align: A => {
            d(A, 2, 3), Q(A, 256, n), (A => {
                16 === A.bi_valid ? (l(A, A.bi_buf), A.bi_buf = 0, A.bi_valid = 0) : A.bi_valid >= 8 && (A.pending_buf[A.pending++] = 255 & A.bi_buf, A.bi_buf >>= 8, A.bi_valid -= 8)
            })(A)
        }
    };
var T = (A, t, e, i) => {
    let s = 65535 & A | 0,
        a = A >>> 16 & 65535 | 0,
        n = 0;
    for (; 0 !== e;) {
        n = e > 2e3 ? 2e3 : e, e -= n;
        do {
            s = s + t[i++] | 0, a = a + s | 0
        } while (--n);
        s %= 65521, a %= 65521
    }
    return s | a << 16 | 0
};
const P = new Uint32Array((() => {
    let A, t = [];
    for (var e = 0; e < 256; e++) {
        A = e;
        for (var i = 0; i < 8; i++) A = 1 & A ? 3988292384 ^ A >>> 1 : A >>> 1;
        t[e] = A
    }
    return t
})());
var K = (A, t, e, i) => {
    const s = P,
        a = i + e;
    A ^= -1;
    for (let e = i; e < a; e++) A = A >>> 8 ^ s[255 & (A ^ t[e])];
    return -1 ^ A
},
    Y = {
        2: "need dictionary",
        1: "stream end",
        0: "",
        "-1": "file error",
        "-2": "stream error",
        "-3": "data error",
        "-4": "insufficient memory",
        "-5": "buffer error",
        "-6": "incompatible version"
    },
    x = {
        Z_NO_FLUSH: 0,
        Z_PARTIAL_FLUSH: 1,
        Z_SYNC_FLUSH: 2,
        Z_FULL_FLUSH: 3,
        Z_FINISH: 4,
        Z_BLOCK: 5,
        Z_TREES: 6,
        Z_OK: 0,
        Z_STREAM_END: 1,
        Z_NEED_DICT: 2,
        Z_ERRNO: -1,
        Z_STREAM_ERROR: -2,
        Z_DATA_ERROR: -3,
        Z_MEM_ERROR: -4,
        Z_BUF_ERROR: -5,
        Z_NO_COMPRESSION: 0,
        Z_BEST_SPEED: 1,
        Z_BEST_COMPRESSION: 9,
        Z_DEFAULT_COMPRESSION: -1,
        Z_FILTERED: 1,
        Z_HUFFMAN_ONLY: 2,
        Z_RLE: 3,
        Z_FIXED: 4,
        Z_DEFAULT_STRATEGY: 0,
        Z_BINARY: 0,
        Z_TEXT: 1,
        Z_UNKNOWN: 2,
        Z_DEFLATED: 8
    };
const {
    _tr_init: O,
    _tr_stored_block: U,
    _tr_flush_block: v,
    _tr_tally: L,
    _tr_align: J
} = G, {
    Z_NO_FLUSH: z,
    Z_PARTIAL_FLUSH: N,
    Z_FULL_FLUSH: Z,
    Z_FINISH: j,
    Z_BLOCK: W,
    Z_OK: q,
    Z_STREAM_END: X,
    Z_STREAM_ERROR: V,
    Z_DATA_ERROR: $,
    Z_BUF_ERROR: AA,
    Z_DEFAULT_COMPRESSION: tA,
    Z_FILTERED: eA,
    Z_HUFFMAN_ONLY: iA,
    Z_RLE: sA,
    Z_FIXED: aA,
    Z_DEFAULT_STRATEGY: nA,
    Z_UNKNOWN: rA,
    Z_DEFLATED: hA
} = x, gA = (A, t) => (A.msg = Y[t], t), oA = A => 2 * A - (A > 4 ? 9 : 0), EA = A => {
    let t = A.length;
    for (; --t >= 0;) A[t] = 0
}, _A = A => {
    let t, e, i, s = A.w_size;
    t = A.hash_size, i = t;
    do {
        e = A.head[--i], A.head[i] = e >= s ? e - s : 0
    } while (--t);
    t = s, i = t;
    do {
        e = A.prev[--i], A.prev[i] = e >= s ? e - s : 0
    } while (--t)
};
let wA = (A, t, e) => (t << A.hash_shift ^ e) & A.hash_mask;
const BA = A => {
    const t = A.state;
    let e = t.pending;
    e > A.avail_out && (e = A.avail_out), 0 !== e && (A.output.set(t.pending_buf.subarray(t.pending_out, t.pending_out + e), A.next_out), A.next_out += e, t.pending_out += e, A.total_out += e, A.avail_out -= e, t.pending -= e, 0 === t.pending && (t.pending_out = 0))
},
    IA = (A, t) => {
        v(A, A.block_start >= 0 ? A.block_start : -1, A.strstart - A.block_start, t), A.block_start = A.strstart, BA(A.strm)
    },
    cA = (A, t) => {
        A.pending_buf[A.pending++] = t
    },
    CA = (A, t) => {
        A.pending_buf[A.pending++] = t >>> 8 & 255, A.pending_buf[A.pending++] = 255 & t
    },
    lA = (A, t, e, i) => {
        let s = A.avail_in;
        return s > i && (s = i), 0 === s ? 0 : (A.avail_in -= s, t.set(A.input.subarray(A.next_in, A.next_in + s), e), 1 === A.state.wrap ? A.adler = T(A.adler, t, s, e) : 2 === A.state.wrap && (A.adler = K(A.adler, t, s, e)), A.next_in += s, A.total_in += s, s)
    },
    dA = (A, t) => {
        let e, i, s = A.max_chain_length,
            a = A.strstart,
            n = A.prev_length,
            r = A.nice_match;
        const h = A.strstart > A.w_size - 262 ? A.strstart - (A.w_size - 262) : 0,
            g = A.window,
            o = A.w_mask,
            E = A.prev,
            _ = A.strstart + 258;
        let w = g[a + n - 1],
            B = g[a + n];
        A.prev_length >= A.good_match && (s >>= 2), r > A.lookahead && (r = A.lookahead);
        do {
            if (e = t, g[e + n] === B && g[e + n - 1] === w && g[e] === g[a] && g[++e] === g[a + 1]) {
                a += 2, e++;
                do { } while (g[++a] === g[++e] && g[++a] === g[++e] && g[++a] === g[++e] && g[++a] === g[++e] && g[++a] === g[++e] && g[++a] === g[++e] && g[++a] === g[++e] && g[++a] === g[++e] && a < _);
                if (i = 258 - (_ - a), a = _ - 258, i > n) {
                    if (A.match_start = t, n = i, i >= r) break;
                    w = g[a + n - 1], B = g[a + n]
                }
            }
        } while ((t = E[t & o]) > h && 0 != --s);
        return n <= A.lookahead ? n : A.lookahead
    },
    QA = A => {
        const t = A.w_size;
        let e, i, s;
        do {
            if (i = A.window_size - A.lookahead - A.strstart, A.strstart >= t + (t - 262) && (A.window.set(A.window.subarray(t, t + t - i), 0), A.match_start -= t, A.strstart -= t, A.block_start -= t, A.insert > A.strstart && (A.insert = A.strstart), _A(A), i += t), 0 === A.strm.avail_in) break;
            if (e = lA(A.strm, A.window, A.strstart + A.lookahead, i), A.lookahead += e, A.lookahead + A.insert >= 3)
                for (s = A.strstart - A.insert, A.ins_h = A.window[s], A.ins_h = wA(A, A.ins_h, A.window[s + 1]); A.insert && (A.ins_h = wA(A, A.ins_h, A.window[s + 3 - 1]), A.prev[s & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = s, s++, A.insert--, !(A.lookahead + A.insert < 3)););
        } while (A.lookahead < 262 && 0 !== A.strm.avail_in)
    },
    fA = (A, t) => {
        let e, i, s, a = A.pending_buf_size - 5 > A.w_size ? A.w_size : A.pending_buf_size - 5,
            n = 0,
            r = A.strm.avail_in;
        do {
            if (e = 65535, s = A.bi_valid + 42 >> 3, A.strm.avail_out < s) break;
            if (s = A.strm.avail_out - s, i = A.strstart - A.block_start, e > i + A.strm.avail_in && (e = i + A.strm.avail_in), e > s && (e = s), e < a && (0 === e && t !== j || t === z || e !== i + A.strm.avail_in)) break;
            n = t === j && e === i + A.strm.avail_in ? 1 : 0, U(A, 0, 0, n), A.pending_buf[A.pending - 4] = e, A.pending_buf[A.pending - 3] = e >> 8, A.pending_buf[A.pending - 2] = ~e, A.pending_buf[A.pending - 1] = ~e >> 8, BA(A.strm), i && (i > e && (i = e), A.strm.output.set(A.window.subarray(A.block_start, A.block_start + i), A.strm.next_out), A.strm.next_out += i, A.strm.avail_out -= i, A.strm.total_out += i, A.block_start += i, e -= i), e && (lA(A.strm, A.strm.output, A.strm.next_out, e), A.strm.next_out += e, A.strm.avail_out -= e, A.strm.total_out += e)
        } while (0 === n);
        return r -= A.strm.avail_in, r && (r >= A.w_size ? (A.matches = 2, A.window.set(A.strm.input.subarray(A.strm.next_in - A.w_size, A.strm.next_in), 0), A.strstart = A.w_size, A.insert = A.strstart) : (A.window_size - A.strstart <= r && (A.strstart -= A.w_size, A.window.set(A.window.subarray(A.w_size, A.w_size + A.strstart), 0), A.matches < 2 && A.matches++, A.insert > A.strstart && (A.insert = A.strstart)), A.window.set(A.strm.input.subarray(A.strm.next_in - r, A.strm.next_in), A.strstart), A.strstart += r, A.insert += r > A.w_size - A.insert ? A.w_size - A.insert : r), A.block_start = A.strstart), A.high_water < A.strstart && (A.high_water = A.strstart), n ? 4 : t !== z && t !== j && 0 === A.strm.avail_in && A.strstart === A.block_start ? 2 : (s = A.window_size - A.strstart, A.strm.avail_in > s && A.block_start >= A.w_size && (A.block_start -= A.w_size, A.strstart -= A.w_size, A.window.set(A.window.subarray(A.w_size, A.w_size + A.strstart), 0), A.matches < 2 && A.matches++, s += A.w_size, A.insert > A.strstart && (A.insert = A.strstart)), s > A.strm.avail_in && (s = A.strm.avail_in), s && (lA(A.strm, A.window, A.strstart, s), A.strstart += s, A.insert += s > A.w_size - A.insert ? A.w_size - A.insert : s), A.high_water < A.strstart && (A.high_water = A.strstart), s = A.bi_valid + 42 >> 3, s = A.pending_buf_size - s > 65535 ? 65535 : A.pending_buf_size - s, a = s > A.w_size ? A.w_size : s, i = A.strstart - A.block_start, (i >= a || (i || t === j) && t !== z && 0 === A.strm.avail_in && i <= s) && (e = i > s ? s : i, n = t === j && 0 === A.strm.avail_in && e === i ? 1 : 0, U(A, A.block_start, e, n), A.block_start += e, BA(A.strm)), n ? 3 : 1)
    },
    DA = (A, t) => {
        let e, i;
        for (; ;) {
            if (A.lookahead < 262) {
                if (QA(A), A.lookahead < 262 && t === z) return 1;
                if (0 === A.lookahead) break
            }
            if (e = 0, A.lookahead >= 3 && (A.ins_h = wA(A, A.ins_h, A.window[A.strstart + 3 - 1]), e = A.prev[A.strstart & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = A.strstart), 0 !== e && A.strstart - e <= A.w_size - 262 && (A.match_length = dA(A, e)), A.match_length >= 3)
                if (i = L(A, A.strstart - A.match_start, A.match_length - 3), A.lookahead -= A.match_length, A.match_length <= A.max_lazy_match && A.lookahead >= 3) {
                    A.match_length--;
                    do {
                        A.strstart++, A.ins_h = wA(A, A.ins_h, A.window[A.strstart + 3 - 1]), e = A.prev[A.strstart & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = A.strstart
                    } while (0 != --A.match_length);
                    A.strstart++
                } else A.strstart += A.match_length, A.match_length = 0, A.ins_h = A.window[A.strstart], A.ins_h = wA(A, A.ins_h, A.window[A.strstart + 1]);
            else i = L(A, 0, A.window[A.strstart]), A.lookahead--, A.strstart++;
            if (i && (IA(A, !1), 0 === A.strm.avail_out)) return 1
        }
        return A.insert = A.strstart < 2 ? A.strstart : 2, t === j ? (IA(A, !0), 0 === A.strm.avail_out ? 3 : 4) : A.sym_next && (IA(A, !1), 0 === A.strm.avail_out) ? 1 : 2
    },
    MA = (A, t) => {
        let e, i, s;
        for (; ;) {
            if (A.lookahead < 262) {
                if (QA(A), A.lookahead < 262 && t === z) return 1;
                if (0 === A.lookahead) break
            }
            if (e = 0, A.lookahead >= 3 && (A.ins_h = wA(A, A.ins_h, A.window[A.strstart + 3 - 1]), e = A.prev[A.strstart & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = A.strstart), A.prev_length = A.match_length, A.prev_match = A.match_start, A.match_length = 2, 0 !== e && A.prev_length < A.max_lazy_match && A.strstart - e <= A.w_size - 262 && (A.match_length = dA(A, e), A.match_length <= 5 && (A.strategy === eA || 3 === A.match_length && A.strstart - A.match_start > 4096) && (A.match_length = 2)), A.prev_length >= 3 && A.match_length <= A.prev_length) {
                s = A.strstart + A.lookahead - 3, i = L(A, A.strstart - 1 - A.prev_match, A.prev_length - 3), A.lookahead -= A.prev_length - 1, A.prev_length -= 2;
                do {
                    ++A.strstart <= s && (A.ins_h = wA(A, A.ins_h, A.window[A.strstart + 3 - 1]), e = A.prev[A.strstart & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = A.strstart)
                } while (0 != --A.prev_length);
                if (A.match_available = 0, A.match_length = 2, A.strstart++, i && (IA(A, !1), 0 === A.strm.avail_out)) return 1
            } else if (A.match_available) {
                if (i = L(A, 0, A.window[A.strstart - 1]), i && IA(A, !1), A.strstart++, A.lookahead--, 0 === A.strm.avail_out) return 1
            } else A.match_available = 1, A.strstart++, A.lookahead--
        }
        return A.match_available && (i = L(A, 0, A.window[A.strstart - 1]), A.match_available = 0), A.insert = A.strstart < 2 ? A.strstart : 2, t === j ? (IA(A, !0), 0 === A.strm.avail_out ? 3 : 4) : A.sym_next && (IA(A, !1), 0 === A.strm.avail_out) ? 1 : 2
    };

function SA(A, t, e, i, s) {
    this.good_length = A, this.max_lazy = t, this.nice_length = e, this.max_chain = i, this.func = s
}
const RA = [new SA(0, 0, 0, 0, fA), new SA(4, 4, 8, 4, DA), new SA(4, 5, 16, 8, DA), new SA(4, 6, 32, 32, DA), new SA(4, 4, 16, 16, MA), new SA(8, 16, 32, 32, MA), new SA(8, 16, 128, 128, MA), new SA(8, 32, 128, 256, MA), new SA(32, 128, 258, 1024, MA), new SA(32, 258, 258, 4096, MA)];

function uA() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = hA, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(1146), this.dyn_dtree = new Uint16Array(122), this.bl_tree = new Uint16Array(78), EA(this.dyn_ltree), EA(this.dyn_dtree), EA(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(16), this.heap = new Uint16Array(573), EA(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(573), EA(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0
}
const pA = A => {
    if (!A) return 1;
    const t = A.state;
    return !t || t.strm !== A || 42 !== t.status && 57 !== t.status && 69 !== t.status && 73 !== t.status && 91 !== t.status && 103 !== t.status && 113 !== t.status && 666 !== t.status ? 1 : 0
},
    yA = A => {
        if (pA(A)) return gA(A, V);
        A.total_in = A.total_out = 0, A.data_type = rA;
        const t = A.state;
        return t.pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = 2 === t.wrap ? 57 : t.wrap ? 42 : 113, A.adler = 2 === t.wrap ? 0 : 1, t.last_flush = -2, O(t), q
    },
    mA = A => {
        const t = yA(A);
        var e;
        return t === q && ((e = A.state).window_size = 2 * e.w_size, EA(e.head), e.max_lazy_match = RA[e.level].max_lazy, e.good_match = RA[e.level].good_length, e.nice_match = RA[e.level].nice_length, e.max_chain_length = RA[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = 2, e.match_available = 0, e.ins_h = 0), t
    },
    kA = (A, t, e, i, s, a) => {
        if (!A) return V;
        let n = 1;
        if (t === tA && (t = 6), i < 0 ? (n = 0, i = -i) : i > 15 && (n = 2, i -= 16), s < 1 || s > 9 || e !== hA || i < 8 || i > 15 || t < 0 || t > 9 || a < 0 || a > aA || 8 === i && 1 !== n) return gA(A, V);
        8 === i && (i = 9);
        const r = new uA;
        return A.state = r, r.strm = A, r.status = 42, r.wrap = n, r.gzhead = null, r.w_bits = i, r.w_size = 1 << r.w_bits, r.w_mask = r.w_size - 1, r.hash_bits = s + 7, r.hash_size = 1 << r.hash_bits, r.hash_mask = r.hash_size - 1, r.hash_shift = ~~((r.hash_bits + 3 - 1) / 3), r.window = new Uint8Array(2 * r.w_size), r.head = new Uint16Array(r.hash_size), r.prev = new Uint16Array(r.w_size), r.lit_bufsize = 1 << s + 6, r.pending_buf_size = 4 * r.lit_bufsize, r.pending_buf = new Uint8Array(r.pending_buf_size), r.sym_buf = r.lit_bufsize, r.sym_end = 3 * (r.lit_bufsize - 1), r.level = t, r.strategy = a, r.method = e, mA(A)
    };
var FA = {
    deflateInit: (A, t) => kA(A, t, hA, 15, 8, nA),
    deflateInit2: kA,
    deflateReset: mA,
    deflateResetKeep: yA,
    deflateSetHeader: (A, t) => pA(A) || 2 !== A.state.wrap ? V : (A.state.gzhead = t, q),
    deflate: (A, t) => {
        if (pA(A) || t > W || t < 0) return A ? gA(A, V) : V;
        const e = A.state;
        if (!A.output || 0 !== A.avail_in && !A.input || 666 === e.status && t !== j) return gA(A, 0 === A.avail_out ? AA : V);
        const i = e.last_flush;
        if (e.last_flush = t, 0 !== e.pending) {
            if (BA(A), 0 === A.avail_out) return e.last_flush = -1, q
        } else if (0 === A.avail_in && oA(t) <= oA(i) && t !== j) return gA(A, AA);
        if (666 === e.status && 0 !== A.avail_in) return gA(A, AA);
        if (42 === e.status && 0 === e.wrap && (e.status = 113), 42 === e.status) {
            let t = hA + (e.w_bits - 8 << 4) << 8,
                i = -1;
            if (i = e.strategy >= iA || e.level < 2 ? 0 : e.level < 6 ? 1 : 6 === e.level ? 2 : 3, t |= i << 6, 0 !== e.strstart && (t |= 32), t += 31 - t % 31, CA(e, t), 0 !== e.strstart && (CA(e, A.adler >>> 16), CA(e, 65535 & A.adler)), A.adler = 1, e.status = 113, BA(A), 0 !== e.pending) return e.last_flush = -1, q
        }
        if (57 === e.status)
            if (A.adler = 0, cA(e, 31), cA(e, 139), cA(e, 8), e.gzhead) cA(e, (e.gzhead.text ? 1 : 0) + (e.gzhead.hcrc ? 2 : 0) + (e.gzhead.extra ? 4 : 0) + (e.gzhead.name ? 8 : 0) + (e.gzhead.comment ? 16 : 0)), cA(e, 255 & e.gzhead.time), cA(e, e.gzhead.time >> 8 & 255), cA(e, e.gzhead.time >> 16 & 255), cA(e, e.gzhead.time >> 24 & 255), cA(e, 9 === e.level ? 2 : e.strategy >= iA || e.level < 2 ? 4 : 0), cA(e, 255 & e.gzhead.os), e.gzhead.extra && e.gzhead.extra.length && (cA(e, 255 & e.gzhead.extra.length), cA(e, e.gzhead.extra.length >> 8 & 255)), e.gzhead.hcrc && (A.adler = K(A.adler, e.pending_buf, e.pending, 0)), e.gzindex = 0, e.status = 69;
            else if (cA(e, 0), cA(e, 0), cA(e, 0), cA(e, 0), cA(e, 0), cA(e, 9 === e.level ? 2 : e.strategy >= iA || e.level < 2 ? 4 : 0), cA(e, 3), e.status = 113, BA(A), 0 !== e.pending) return e.last_flush = -1, q;
        if (69 === e.status) {
            if (e.gzhead.extra) {
                let t = e.pending,
                    i = (65535 & e.gzhead.extra.length) - e.gzindex;
                for (; e.pending + i > e.pending_buf_size;) {
                    let s = e.pending_buf_size - e.pending;
                    if (e.pending_buf.set(e.gzhead.extra.subarray(e.gzindex, e.gzindex + s), e.pending), e.pending = e.pending_buf_size, e.gzhead.hcrc && e.pending > t && (A.adler = K(A.adler, e.pending_buf, e.pending - t, t)), e.gzindex += s, BA(A), 0 !== e.pending) return e.last_flush = -1, q;
                    t = 0, i -= s
                }
                let s = new Uint8Array(e.gzhead.extra);
                e.pending_buf.set(s.subarray(e.gzindex, e.gzindex + i), e.pending), e.pending += i, e.gzhead.hcrc && e.pending > t && (A.adler = K(A.adler, e.pending_buf, e.pending - t, t)), e.gzindex = 0
            }
            e.status = 73
        }
        if (73 === e.status) {
            if (e.gzhead.name) {
                let t, i = e.pending;
                do {
                    if (e.pending === e.pending_buf_size) {
                        if (e.gzhead.hcrc && e.pending > i && (A.adler = K(A.adler, e.pending_buf, e.pending - i, i)), BA(A), 0 !== e.pending) return e.last_flush = -1, q;
                        i = 0
                    }
                    t = e.gzindex < e.gzhead.name.length ? 255 & e.gzhead.name.charCodeAt(e.gzindex++) : 0, cA(e, t)
                } while (0 !== t);
                e.gzhead.hcrc && e.pending > i && (A.adler = K(A.adler, e.pending_buf, e.pending - i, i)), e.gzindex = 0
            }
            e.status = 91
        }
        if (91 === e.status) {
            if (e.gzhead.comment) {
                let t, i = e.pending;
                do {
                    if (e.pending === e.pending_buf_size) {
                        if (e.gzhead.hcrc && e.pending > i && (A.adler = K(A.adler, e.pending_buf, e.pending - i, i)), BA(A), 0 !== e.pending) return e.last_flush = -1, q;
                        i = 0
                    }
                    t = e.gzindex < e.gzhead.comment.length ? 255 & e.gzhead.comment.charCodeAt(e.gzindex++) : 0, cA(e, t)
                } while (0 !== t);
                e.gzhead.hcrc && e.pending > i && (A.adler = K(A.adler, e.pending_buf, e.pending - i, i))
            }
            e.status = 103
        }
        if (103 === e.status) {
            if (e.gzhead.hcrc) {
                if (e.pending + 2 > e.pending_buf_size && (BA(A), 0 !== e.pending)) return e.last_flush = -1, q;
                cA(e, 255 & A.adler), cA(e, A.adler >> 8 & 255), A.adler = 0
            }
            if (e.status = 113, BA(A), 0 !== e.pending) return e.last_flush = -1, q
        }
        if (0 !== A.avail_in || 0 !== e.lookahead || t !== z && 666 !== e.status) {
            let i = 0 === e.level ? fA(e, t) : e.strategy === iA ? ((A, t) => {
                let e;
                for (; ;) {
                    if (0 === A.lookahead && (QA(A), 0 === A.lookahead)) {
                        if (t === z) return 1;
                        break
                    }
                    if (A.match_length = 0, e = L(A, 0, A.window[A.strstart]), A.lookahead--, A.strstart++, e && (IA(A, !1), 0 === A.strm.avail_out)) return 1
                }
                return A.insert = 0, t === j ? (IA(A, !0), 0 === A.strm.avail_out ? 3 : 4) : A.sym_next && (IA(A, !1), 0 === A.strm.avail_out) ? 1 : 2
            })(e, t) : e.strategy === sA ? ((A, t) => {
                let e, i, s, a;
                const n = A.window;
                for (; ;) {
                    if (A.lookahead <= 258) {
                        if (QA(A), A.lookahead <= 258 && t === z) return 1;
                        if (0 === A.lookahead) break
                    }
                    if (A.match_length = 0, A.lookahead >= 3 && A.strstart > 0 && (s = A.strstart - 1, i = n[s], i === n[++s] && i === n[++s] && i === n[++s])) {
                        a = A.strstart + 258;
                        do { } while (i === n[++s] && i === n[++s] && i === n[++s] && i === n[++s] && i === n[++s] && i === n[++s] && i === n[++s] && i === n[++s] && s < a);
                        A.match_length = 258 - (a - s), A.match_length > A.lookahead && (A.match_length = A.lookahead)
                    }
                    if (A.match_length >= 3 ? (e = L(A, 1, A.match_length - 3), A.lookahead -= A.match_length, A.strstart += A.match_length, A.match_length = 0) : (e = L(A, 0, A.window[A.strstart]), A.lookahead--, A.strstart++), e && (IA(A, !1), 0 === A.strm.avail_out)) return 1
                }
                return A.insert = 0, t === j ? (IA(A, !0), 0 === A.strm.avail_out ? 3 : 4) : A.sym_next && (IA(A, !1), 0 === A.strm.avail_out) ? 1 : 2
            })(e, t) : RA[e.level].func(e, t);
            if (3 !== i && 4 !== i || (e.status = 666), 1 === i || 3 === i) return 0 === A.avail_out && (e.last_flush = -1), q;
            if (2 === i && (t === N ? J(e) : t !== W && (U(e, 0, 0, !1), t === Z && (EA(e.head), 0 === e.lookahead && (e.strstart = 0, e.block_start = 0, e.insert = 0))), BA(A), 0 === A.avail_out)) return e.last_flush = -1, q
        }
        return t !== j ? q : e.wrap <= 0 ? X : (2 === e.wrap ? (cA(e, 255 & A.adler), cA(e, A.adler >> 8 & 255), cA(e, A.adler >> 16 & 255), cA(e, A.adler >> 24 & 255), cA(e, 255 & A.total_in), cA(e, A.total_in >> 8 & 255), cA(e, A.total_in >> 16 & 255), cA(e, A.total_in >> 24 & 255)) : (CA(e, A.adler >>> 16), CA(e, 65535 & A.adler)), BA(A), e.wrap > 0 && (e.wrap = -e.wrap), 0 !== e.pending ? q : X)
    },
    deflateEnd: A => {
        if (pA(A)) return V;
        const t = A.state.status;
        return A.state = null, 113 === t ? gA(A, $) : q
    },
    deflateSetDictionary: (A, t) => {
        let e = t.length;
        if (pA(A)) return V;
        const i = A.state,
            s = i.wrap;
        if (2 === s || 1 === s && 42 !== i.status || i.lookahead) return V;
        if (1 === s && (A.adler = T(A.adler, t, e, 0)), i.wrap = 0, e >= i.w_size) {
            0 === s && (EA(i.head), i.strstart = 0, i.block_start = 0, i.insert = 0);
            let A = new Uint8Array(i.w_size);
            A.set(t.subarray(e - i.w_size, e), 0), t = A, e = i.w_size
        }
        const a = A.avail_in,
            n = A.next_in,
            r = A.input;
        for (A.avail_in = e, A.next_in = 0, A.input = t, QA(i); i.lookahead >= 3;) {
            let A = i.strstart,
                t = i.lookahead - 2;
            do {
                i.ins_h = wA(i, i.ins_h, i.window[A + 3 - 1]), i.prev[A & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = A, A++
            } while (--t);
            i.strstart = A, i.lookahead = 2, QA(i)
        }
        return i.strstart += i.lookahead, i.block_start = i.strstart, i.insert = i.lookahead, i.lookahead = 0, i.match_length = i.prev_length = 2, i.match_available = 0, A.next_in = n, A.input = r, A.avail_in = a, i.wrap = s, q
    },
    deflateInfo: "pako deflate (from Nodeca project)"
};
const bA = (A, t) => Object.prototype.hasOwnProperty.call(A, t);
var HA = function (A) {
    const t = Array.prototype.slice.call(arguments, 1);
    for (; t.length;) {
        const e = t.shift();
        if (e) {
            if ("object" != typeof e) throw new TypeError(e + "must be non-object");
            for (const t in e) bA(e, t) && (A[t] = e[t])
        }
    }
    return A
},
    GA = A => {
        let t = 0;
        for (let e = 0, i = A.length; e < i; e++) t += A[e].length;
        const e = new Uint8Array(t);
        for (let t = 0, i = 0, s = A.length; t < s; t++) {
            let s = A[t];
            e.set(s, i), i += s.length
        }
        return e
    };
let TA = !0;
try {
    String.fromCharCode.apply(null, new Uint8Array(1))
} catch (A) {
    TA = !1
}
const PA = new Uint8Array(256);
for (let A = 0; A < 256; A++) PA[A] = A >= 252 ? 6 : A >= 248 ? 5 : A >= 240 ? 4 : A >= 224 ? 3 : A >= 192 ? 2 : 1;
PA[254] = PA[254] = 1;
var KA = A => {
    if ("function" == typeof TextEncoder && TextEncoder.prototype.encode) return (new TextEncoder).encode(A);
    let t, e, i, s, a, n = A.length,
        r = 0;
    for (s = 0; s < n; s++) e = A.charCodeAt(s), 55296 == (64512 & e) && s + 1 < n && (i = A.charCodeAt(s + 1), 56320 == (64512 & i) && (e = 65536 + (e - 55296 << 10) + (i - 56320), s++)), r += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4;
    for (t = new Uint8Array(r), a = 0, s = 0; a < r; s++) e = A.charCodeAt(s), 55296 == (64512 & e) && s + 1 < n && (i = A.charCodeAt(s + 1), 56320 == (64512 & i) && (e = 65536 + (e - 55296 << 10) + (i - 56320), s++)), e < 128 ? t[a++] = e : e < 2048 ? (t[a++] = 192 | e >>> 6, t[a++] = 128 | 63 & e) : e < 65536 ? (t[a++] = 224 | e >>> 12, t[a++] = 128 | e >>> 6 & 63, t[a++] = 128 | 63 & e) : (t[a++] = 240 | e >>> 18, t[a++] = 128 | e >>> 12 & 63, t[a++] = 128 | e >>> 6 & 63, t[a++] = 128 | 63 & e);
    return t
},
    YA = (A, t) => {
        const e = t || A.length;
        if ("function" == typeof TextDecoder && TextDecoder.prototype.decode) return (new TextDecoder).decode(A.subarray(0, t));
        let i, s;
        const a = new Array(2 * e);
        for (s = 0, i = 0; i < e;) {
            let t = A[i++];
            if (t < 128) {
                a[s++] = t;
                continue
            }
            let n = PA[t];
            if (n > 4) a[s++] = 65533, i += n - 1;
            else {
                for (t &= 2 === n ? 31 : 3 === n ? 15 : 7; n > 1 && i < e;) t = t << 6 | 63 & A[i++], n--;
                n > 1 ? a[s++] = 65533 : t < 65536 ? a[s++] = t : (t -= 65536, a[s++] = 55296 | t >> 10 & 1023, a[s++] = 56320 | 1023 & t)
            }
        }
        return ((A, t) => {
            if (t < 65534 && A.subarray && TA) return String.fromCharCode.apply(null, A.length === t ? A : A.subarray(0, t));
            let e = "";
            for (let i = 0; i < t; i++) e += String.fromCharCode(A[i]);
            return e
        })(a, s)
    },
    xA = (A, t) => {
        (t = t || A.length) > A.length && (t = A.length);
        let e = t - 1;
        for (; e >= 0 && 128 == (192 & A[e]);) e--;
        return e < 0 || 0 === e ? t : e + PA[A[e]] > t ? e : t
    };
var OA = function () {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0
};
const UA = Object.prototype.toString,
    {
        Z_NO_FLUSH: vA,
        Z_SYNC_FLUSH: LA,
        Z_FULL_FLUSH: JA,
        Z_FINISH: zA,
        Z_OK: NA,
        Z_STREAM_END: ZA,
        Z_DEFAULT_COMPRESSION: jA,
        Z_DEFAULT_STRATEGY: WA,
        Z_DEFLATED: qA
    } = x;

function XA(A) {
    this.options = HA({
        level: jA,
        method: qA,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: WA
    }, A || {});
    let t = this.options;
    t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new OA, this.strm.avail_out = 0;
    let e = FA.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
    if (e !== NA) throw new Error(Y[e]);
    if (t.header && FA.deflateSetHeader(this.strm, t.header), t.dictionary) {
        let A;
        if (A = "string" == typeof t.dictionary ? KA(t.dictionary) : "[object ArrayBuffer]" === UA.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary, e = FA.deflateSetDictionary(this.strm, A), e !== NA) throw new Error(Y[e]);
        this._dict_set = !0
    }
}

function VA(A, t) {
    const e = new XA(t);
    if (e.push(A, !0), e.err) throw e.msg || Y[e.err];
    return e.result
}
XA.prototype.push = function (A, t) {
    const e = this.strm,
        i = this.options.chunkSize;
    let s, a;
    if (this.ended) return !1;
    for (a = t === ~~t ? t : !0 === t ? zA : vA, "string" == typeof A ? e.input = KA(A) : "[object ArrayBuffer]" === UA.call(A) ? e.input = new Uint8Array(A) : e.input = A, e.next_in = 0, e.avail_in = e.input.length; ;)
        if (0 === e.avail_out && (e.output = new Uint8Array(i), e.next_out = 0, e.avail_out = i), (a === LA || a === JA) && e.avail_out <= 6) this.onData(e.output.subarray(0, e.next_out)), e.avail_out = 0;
        else {
            if (s = FA.deflate(e, a), s === ZA) return e.next_out > 0 && this.onData(e.output.subarray(0, e.next_out)), s = FA.deflateEnd(this.strm), this.onEnd(s), this.ended = !0, s === NA;
            if (0 !== e.avail_out) {
                if (a > 0 && e.next_out > 0) this.onData(e.output.subarray(0, e.next_out)), e.avail_out = 0;
                else if (0 === e.avail_in) break
            } else this.onData(e.output)
        } return !0
}, XA.prototype.onData = function (A) {
    this.chunks.push(A)
}, XA.prototype.onEnd = function (A) {
    A === NA && (this.result = GA(this.chunks)), this.chunks = [], this.err = A, this.msg = this.strm.msg
};
var $A = {
    Deflate: XA,
    deflate: VA,
    deflateRaw: function (A, t) {
        return (t = t || {}).raw = !0, VA(A, t)
    },
    gzip: function (A, t) {
        return (t = t || {}).gzip = !0, VA(A, t)
    },
    constants: x
};
var At = function (A, t) {
    let e, i, s, a, n, r, h, g, o, E, _, w, B, I, c, C, l, d, Q, f, D, M, S, R;
    const u = A.state;
    e = A.next_in, S = A.input, i = e + (A.avail_in - 5), s = A.next_out, R = A.output, a = s - (t - A.avail_out), n = s + (A.avail_out - 257), r = u.dmax, h = u.wsize, g = u.whave, o = u.wnext, E = u.window, _ = u.hold, w = u.bits, B = u.lencode, I = u.distcode, c = (1 << u.lenbits) - 1, C = (1 << u.distbits) - 1;
    A: do {
        w < 15 && (_ += S[e++] << w, w += 8, _ += S[e++] << w, w += 8), l = B[_ & c];
        t: for (; ;) {
            if (d = l >>> 24, _ >>>= d, w -= d, d = l >>> 16 & 255, 0 === d) R[s++] = 65535 & l;
            else {
                if (!(16 & d)) {
                    if (0 == (64 & d)) {
                        l = B[(65535 & l) + (_ & (1 << d) - 1)];
                        continue t
                    }
                    if (32 & d) {
                        u.mode = 16191;
                        break A
                    }
                    A.msg = "invalid literal/length code", u.mode = 16209;
                    break A
                }
                Q = 65535 & l, d &= 15, d && (w < d && (_ += S[e++] << w, w += 8), Q += _ & (1 << d) - 1, _ >>>= d, w -= d), w < 15 && (_ += S[e++] << w, w += 8, _ += S[e++] << w, w += 8), l = I[_ & C];
                e: for (; ;) {
                    if (d = l >>> 24, _ >>>= d, w -= d, d = l >>> 16 & 255, !(16 & d)) {
                        if (0 == (64 & d)) {
                            l = I[(65535 & l) + (_ & (1 << d) - 1)];
                            continue e
                        }
                        A.msg = "invalid distance code", u.mode = 16209;
                        break A
                    }
                    if (f = 65535 & l, d &= 15, w < d && (_ += S[e++] << w, w += 8, w < d && (_ += S[e++] << w, w += 8)), f += _ & (1 << d) - 1, f > r) {
                        A.msg = "invalid distance too far back", u.mode = 16209;
                        break A
                    }
                    if (_ >>>= d, w -= d, d = s - a, f > d) {
                        if (d = f - d, d > g && u.sane) {
                            A.msg = "invalid distance too far back", u.mode = 16209;
                            break A
                        }
                        if (D = 0, M = E, 0 === o) {
                            if (D += h - d, d < Q) {
                                Q -= d;
                                do {
                                    R[s++] = E[D++]
                                } while (--d);
                                D = s - f, M = R
                            }
                        } else if (o < d) {
                            if (D += h + o - d, d -= o, d < Q) {
                                Q -= d;
                                do {
                                    R[s++] = E[D++]
                                } while (--d);
                                if (D = 0, o < Q) {
                                    d = o, Q -= d;
                                    do {
                                        R[s++] = E[D++]
                                    } while (--d);
                                    D = s - f, M = R
                                }
                            }
                        } else if (D += o - d, d < Q) {
                            Q -= d;
                            do {
                                R[s++] = E[D++]
                            } while (--d);
                            D = s - f, M = R
                        }
                        for (; Q > 2;) R[s++] = M[D++], R[s++] = M[D++], R[s++] = M[D++], Q -= 3;
                        Q && (R[s++] = M[D++], Q > 1 && (R[s++] = M[D++]))
                    } else {
                        D = s - f;
                        do {
                            R[s++] = R[D++], R[s++] = R[D++], R[s++] = R[D++], Q -= 3
                        } while (Q > 2);
                        Q && (R[s++] = R[D++], Q > 1 && (R[s++] = R[D++]))
                    }
                    break
                }
            }
            break
        }
    } while (e < i && s < n);
    Q = w >> 3, e -= Q, w -= Q << 3, _ &= (1 << w) - 1, A.next_in = e, A.next_out = s, A.avail_in = e < i ? i - e + 5 : 5 - (e - i), A.avail_out = s < n ? n - s + 257 : 257 - (s - n), u.hold = _, u.bits = w
};
const tt = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]),
    et = new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]),
    it = new Uint16Array([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]),
    st = new Uint8Array([16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]);
var at = (A, t, e, i, s, a, n, r) => {
    const h = r.bits;
    let g, o, E, _, w, B, I = 0,
        c = 0,
        C = 0,
        l = 0,
        d = 0,
        Q = 0,
        f = 0,
        D = 0,
        M = 0,
        S = 0,
        R = null;
    const u = new Uint16Array(16),
        p = new Uint16Array(16);
    let y, m, k, F = null;
    for (I = 0; I <= 15; I++) u[I] = 0;
    for (c = 0; c < i; c++) u[t[e + c]]++;
    for (d = h, l = 15; l >= 1 && 0 === u[l]; l--);
    if (d > l && (d = l), 0 === l) return s[a++] = 20971520, s[a++] = 20971520, r.bits = 1, 0;
    for (C = 1; C < l && 0 === u[C]; C++);
    for (d < C && (d = C), D = 1, I = 1; I <= 15; I++)
        if (D <<= 1, D -= u[I], D < 0) return -1;
    if (D > 0 && (0 === A || 1 !== l)) return -1;
    for (p[1] = 0, I = 1; I < 15; I++) p[I + 1] = p[I] + u[I];
    for (c = 0; c < i; c++) 0 !== t[e + c] && (n[p[t[e + c]]++] = c);
    if (0 === A ? (R = F = n, B = 20) : 1 === A ? (R = tt, F = et, B = 257) : (R = it, F = st, B = 0), S = 0, c = 0, I = C, w = a, Q = d, f = 0, E = -1, M = 1 << d, _ = M - 1, 1 === A && M > 852 || 2 === A && M > 592) return 1;
    for (; ;) {
        y = I - f, n[c] + 1 < B ? (m = 0, k = n[c]) : n[c] >= B ? (m = F[n[c] - B], k = R[n[c] - B]) : (m = 96, k = 0), g = 1 << I - f, o = 1 << Q, C = o;
        do {
            o -= g, s[w + (S >> f) + o] = y << 24 | m << 16 | k | 0
        } while (0 !== o);
        for (g = 1 << I - 1; S & g;) g >>= 1;
        if (0 !== g ? (S &= g - 1, S += g) : S = 0, c++, 0 == --u[I]) {
            if (I === l) break;
            I = t[e + n[c]]
        }
        if (I > d && (S & _) !== E) {
            for (0 === f && (f = d), w += C, Q = I - f, D = 1 << Q; Q + f < l && (D -= u[Q + f], !(D <= 0));) Q++, D <<= 1;
            if (M += 1 << Q, 1 === A && M > 852 || 2 === A && M > 592) return 1;
            E = S & _, s[E] = d << 24 | Q << 16 | w - a | 0
        }
    }
    return 0 !== S && (s[w + S] = I - f << 24 | 64 << 16 | 0), r.bits = d, 0
};
const {
    Z_FINISH: nt,
    Z_BLOCK: rt,
    Z_TREES: ht,
    Z_OK: gt,
    Z_STREAM_END: ot,
    Z_NEED_DICT: Et,
    Z_STREAM_ERROR: _t,
    Z_DATA_ERROR: wt,
    Z_MEM_ERROR: Bt,
    Z_BUF_ERROR: It,
    Z_DEFLATED: ct
} = x, Ct = 16209, lt = A => (A >>> 24 & 255) + (A >>> 8 & 65280) + ((65280 & A) << 8) + ((255 & A) << 24);

function dt() {
    this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0
}
const Qt = A => {
    if (!A) return 1;
    const t = A.state;
    return !t || t.strm !== A || t.mode < 16180 || t.mode > 16211 ? 1 : 0
},
    ft = A => {
        if (Qt(A)) return _t;
        const t = A.state;
        return A.total_in = A.total_out = t.total = 0, A.msg = "", t.wrap && (A.adler = 1 & t.wrap), t.mode = 16180, t.last = 0, t.havedict = 0, t.flags = -1, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new Int32Array(852), t.distcode = t.distdyn = new Int32Array(592), t.sane = 1, t.back = -1, gt
    },
    Dt = A => {
        if (Qt(A)) return _t;
        const t = A.state;
        return t.wsize = 0, t.whave = 0, t.wnext = 0, ft(A)
    },
    Mt = (A, t) => {
        let e;
        if (Qt(A)) return _t;
        const i = A.state;
        return t < 0 ? (e = 0, t = -t) : (e = 5 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? _t : (null !== i.window && i.wbits !== t && (i.window = null), i.wrap = e, i.wbits = t, Dt(A))
    },
    St = (A, t) => {
        if (!A) return _t;
        const e = new dt;
        A.state = e, e.strm = A, e.window = null, e.mode = 16180;
        const i = Mt(A, t);
        return i !== gt && (A.state = null), i
    };
let Rt, ut, pt = !0;
const yt = A => {
    if (pt) {
        Rt = new Int32Array(512), ut = new Int32Array(32);
        let t = 0;
        for (; t < 144;) A.lens[t++] = 8;
        for (; t < 256;) A.lens[t++] = 9;
        for (; t < 280;) A.lens[t++] = 7;
        for (; t < 288;) A.lens[t++] = 8;
        for (at(1, A.lens, 0, 288, Rt, 0, A.work, {
            bits: 9
        }), t = 0; t < 32;) A.lens[t++] = 5;
        at(2, A.lens, 0, 32, ut, 0, A.work, {
            bits: 5
        }), pt = !1
    }
    A.lencode = Rt, A.lenbits = 9, A.distcode = ut, A.distbits = 5
},
    mt = (A, t, e, i) => {
        let s;
        const a = A.state;
        return null === a.window && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = new Uint8Array(a.wsize)), i >= a.wsize ? (a.window.set(t.subarray(e - a.wsize, e), 0), a.wnext = 0, a.whave = a.wsize) : (s = a.wsize - a.wnext, s > i && (s = i), a.window.set(t.subarray(e - i, e - i + s), a.wnext), (i -= s) ? (a.window.set(t.subarray(e - i, e), 0), a.wnext = i, a.whave = a.wsize) : (a.wnext += s, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += s))), 0
    };
var kt = {
    inflateReset: Dt,
    inflateReset2: Mt,
    inflateResetKeep: ft,
    inflateInit: A => St(A, 15),
    inflateInit2: St,
    inflate: (A, t) => {
        let e, i, s, a, n, r, h, g, o, E, _, w, B, I, c, C, l, d, Q, f, D, M, S = 0;
        const R = new Uint8Array(4);
        let u, p;
        const y = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
        if (Qt(A) || !A.output || !A.input && 0 !== A.avail_in) return _t;
        e = A.state, 16191 === e.mode && (e.mode = 16192), n = A.next_out, s = A.output, h = A.avail_out, a = A.next_in, i = A.input, r = A.avail_in, g = e.hold, o = e.bits, E = r, _ = h, M = gt;
        A: for (; ;) switch (e.mode) {
            case 16180:
                if (0 === e.wrap) {
                    e.mode = 16192;
                    break
                }
                for (; o < 16;) {
                    if (0 === r) break A;
                    r--, g += i[a++] << o, o += 8
                }
                if (2 & e.wrap && 35615 === g) {
                    0 === e.wbits && (e.wbits = 15), e.check = 0, R[0] = 255 & g, R[1] = g >>> 8 & 255, e.check = K(e.check, R, 2, 0), g = 0, o = 0, e.mode = 16181;
                    break
                }
                if (e.head && (e.head.done = !1), !(1 & e.wrap) || (((255 & g) << 8) + (g >> 8)) % 31) {
                    A.msg = "incorrect header check", e.mode = Ct;
                    break
                }
                if ((15 & g) !== ct) {
                    A.msg = "unknown compression method", e.mode = Ct;
                    break
                }
                if (g >>>= 4, o -= 4, D = 8 + (15 & g), 0 === e.wbits && (e.wbits = D), D > 15 || D > e.wbits) {
                    A.msg = "invalid window size", e.mode = Ct;
                    break
                }
                e.dmax = 1 << e.wbits, e.flags = 0, A.adler = e.check = 1, e.mode = 512 & g ? 16189 : 16191, g = 0, o = 0;
                break;
            case 16181:
                for (; o < 16;) {
                    if (0 === r) break A;
                    r--, g += i[a++] << o, o += 8
                }
                if (e.flags = g, (255 & e.flags) !== ct) {
                    A.msg = "unknown compression method", e.mode = Ct;
                    break
                }
                if (57344 & e.flags) {
                    A.msg = "unknown header flags set", e.mode = Ct;
                    break
                }
                e.head && (e.head.text = g >> 8 & 1), 512 & e.flags && 4 & e.wrap && (R[0] = 255 & g, R[1] = g >>> 8 & 255, e.check = K(e.check, R, 2, 0)), g = 0, o = 0, e.mode = 16182;
            case 16182:
                for (; o < 32;) {
                    if (0 === r) break A;
                    r--, g += i[a++] << o, o += 8
                }
                e.head && (e.head.time = g), 512 & e.flags && 4 & e.wrap && (R[0] = 255 & g, R[1] = g >>> 8 & 255, R[2] = g >>> 16 & 255, R[3] = g >>> 24 & 255, e.check = K(e.check, R, 4, 0)), g = 0, o = 0, e.mode = 16183;
            case 16183:
                for (; o < 16;) {
                    if (0 === r) break A;
                    r--, g += i[a++] << o, o += 8
                }
                e.head && (e.head.xflags = 255 & g, e.head.os = g >> 8), 512 & e.flags && 4 & e.wrap && (R[0] = 255 & g, R[1] = g >>> 8 & 255, e.check = K(e.check, R, 2, 0)), g = 0, o = 0, e.mode = 16184;
            case 16184:
                if (1024 & e.flags) {
                    for (; o < 16;) {
                        if (0 === r) break A;
                        r--, g += i[a++] << o, o += 8
                    }
                    e.length = g, e.head && (e.head.extra_len = g), 512 & e.flags && 4 & e.wrap && (R[0] = 255 & g, R[1] = g >>> 8 & 255, e.check = K(e.check, R, 2, 0)), g = 0, o = 0
                } else e.head && (e.head.extra = null);
                e.mode = 16185;
            case 16185:
                if (1024 & e.flags && (w = e.length, w > r && (w = r), w && (e.head && (D = e.head.extra_len - e.length, e.head.extra || (e.head.extra = new Uint8Array(e.head.extra_len)), e.head.extra.set(i.subarray(a, a + w), D)), 512 & e.flags && 4 & e.wrap && (e.check = K(e.check, i, w, a)), r -= w, a += w, e.length -= w), e.length)) break A;
                e.length = 0, e.mode = 16186;
            case 16186:
                if (2048 & e.flags) {
                    if (0 === r) break A;
                    w = 0;
                    do {
                        D = i[a + w++], e.head && D && e.length < 65536 && (e.head.name += String.fromCharCode(D))
                    } while (D && w < r);
                    if (512 & e.flags && 4 & e.wrap && (e.check = K(e.check, i, w, a)), r -= w, a += w, D) break A
                } else e.head && (e.head.name = null);
                e.length = 0, e.mode = 16187;
            case 16187:
                if (4096 & e.flags) {
                    if (0 === r) break A;
                    w = 0;
                    do {
                        D = i[a + w++], e.head && D && e.length < 65536 && (e.head.comment += String.fromCharCode(D))
                    } while (D && w < r);
                    if (512 & e.flags && 4 & e.wrap && (e.check = K(e.check, i, w, a)), r -= w, a += w, D) break A
                } else e.head && (e.head.comment = null);
                e.mode = 16188;
            case 16188:
                if (512 & e.flags) {
                    for (; o < 16;) {
                        if (0 === r) break A;
                        r--, g += i[a++] << o, o += 8
                    }
                    if (4 & e.wrap && g !== (65535 & e.check)) {
                        A.msg = "header crc mismatch", e.mode = Ct;
                        break
                    }
                    g = 0, o = 0
                }
                e.head && (e.head.hcrc = e.flags >> 9 & 1, e.head.done = !0), A.adler = e.check = 0, e.mode = 16191;
                break;
            case 16189:
                for (; o < 32;) {
                    if (0 === r) break A;
                    r--, g += i[a++] << o, o += 8
                }
                A.adler = e.check = lt(g), g = 0, o = 0, e.mode = 16190;
            case 16190:
                if (0 === e.havedict) return A.next_out = n, A.avail_out = h, A.next_in = a, A.avail_in = r, e.hold = g, e.bits = o, Et;
                A.adler = e.check = 1, e.mode = 16191;
            case 16191:
                if (t === rt || t === ht) break A;
            case 16192:
                if (e.last) {
                    g >>>= 7 & o, o -= 7 & o, e.mode = 16206;
                    break
                }
                for (; o < 3;) {
                    if (0 === r) break A;
                    r--, g += i[a++] << o, o += 8
                }
                switch (e.last = 1 & g, g >>>= 1, o -= 1, 3 & g) {
                    case 0:
                        e.mode = 16193;
                        break;
                    case 1:
                        if (yt(e), e.mode = 16199, t === ht) {
                            g >>>= 2, o -= 2;
                            break A
                        }
                        break;
                    case 2:
                        e.mode = 16196;
                        break;
                    case 3:
                        A.msg = "invalid block type", e.mode = Ct
                }
                g >>>= 2, o -= 2;
                break;
            case 16193:
                for (g >>>= 7 & o, o -= 7 & o; o < 32;) {
                    if (0 === r) break A;
                    r--, g += i[a++] << o, o += 8
                }
                if ((65535 & g) != (g >>> 16 ^ 65535)) {
                    A.msg = "invalid stored block lengths", e.mode = Ct;
                    break
                }
                if (e.length = 65535 & g, g = 0, o = 0, e.mode = 16194, t === ht) break A;
            case 16194:
                e.mode = 16195;
            case 16195:
                if (w = e.length, w) {
                    if (w > r && (w = r), w > h && (w = h), 0 === w) break A;
                    s.set(i.subarray(a, a + w), n), r -= w, a += w, h -= w, n += w, e.length -= w;
                    break
                }
                e.mode = 16191;
                break;
            case 16196:
                for (; o < 14;) {
                    if (0 === r) break A;
                    r--, g += i[a++] << o, o += 8
                }
                if (e.nlen = 257 + (31 & g), g >>>= 5, o -= 5, e.ndist = 1 + (31 & g), g >>>= 5, o -= 5, e.ncode = 4 + (15 & g), g >>>= 4, o -= 4, e.nlen > 286 || e.ndist > 30) {
                    A.msg = "too many length or distance symbols", e.mode = Ct;
                    break
                }
                e.have = 0, e.mode = 16197;
            case 16197:
                for (; e.have < e.ncode;) {
                    for (; o < 3;) {
                        if (0 === r) break A;
                        r--, g += i[a++] << o, o += 8
                    }
                    e.lens[y[e.have++]] = 7 & g, g >>>= 3, o -= 3
                }
                for (; e.have < 19;) e.lens[y[e.have++]] = 0;
                if (e.lencode = e.lendyn, e.lenbits = 7, u = {
                    bits: e.lenbits
                }, M = at(0, e.lens, 0, 19, e.lencode, 0, e.work, u), e.lenbits = u.bits, M) {
                    A.msg = "invalid code lengths set", e.mode = Ct;
                    break
                }
                e.have = 0, e.mode = 16198;
            case 16198:
                for (; e.have < e.nlen + e.ndist;) {
                    for (; S = e.lencode[g & (1 << e.lenbits) - 1], c = S >>> 24, C = S >>> 16 & 255, l = 65535 & S, !(c <= o);) {
                        if (0 === r) break A;
                        r--, g += i[a++] << o, o += 8
                    }
                    if (l < 16) g >>>= c, o -= c, e.lens[e.have++] = l;
                    else {
                        if (16 === l) {
                            for (p = c + 2; o < p;) {
                                if (0 === r) break A;
                                r--, g += i[a++] << o, o += 8
                            }
                            if (g >>>= c, o -= c, 0 === e.have) {
                                A.msg = "invalid bit length repeat", e.mode = Ct;
                                break
                            }
                            D = e.lens[e.have - 1], w = 3 + (3 & g), g >>>= 2, o -= 2
                        } else if (17 === l) {
                            for (p = c + 3; o < p;) {
                                if (0 === r) break A;
                                r--, g += i[a++] << o, o += 8
                            }
                            g >>>= c, o -= c, D = 0, w = 3 + (7 & g), g >>>= 3, o -= 3
                        } else {
                            for (p = c + 7; o < p;) {
                                if (0 === r) break A;
                                r--, g += i[a++] << o, o += 8
                            }
                            g >>>= c, o -= c, D = 0, w = 11 + (127 & g), g >>>= 7, o -= 7
                        }
                        if (e.have + w > e.nlen + e.ndist) {
                            A.msg = "invalid bit length repeat", e.mode = Ct;
                            break
                        }
                        for (; w--;) e.lens[e.have++] = D
                    }
                }
                if (e.mode === Ct) break;
                if (0 === e.lens[256]) {
                    A.msg = "invalid code -- missing end-of-block", e.mode = Ct;
                    break
                }
                if (e.lenbits = 9, u = {
                    bits: e.lenbits
                }, M = at(1, e.lens, 0, e.nlen, e.lencode, 0, e.work, u), e.lenbits = u.bits, M) {
                    A.msg = "invalid literal/lengths set", e.mode = Ct;
                    break
                }
                if (e.distbits = 6, e.distcode = e.distdyn, u = {
                    bits: e.distbits
                }, M = at(2, e.lens, e.nlen, e.ndist, e.distcode, 0, e.work, u), e.distbits = u.bits, M) {
                    A.msg = "invalid distances set", e.mode = Ct;
                    break
                }
                if (e.mode = 16199, t === ht) break A;
            case 16199:
                e.mode = 16200;
            case 16200:
                if (r >= 6 && h >= 258) {
                    A.next_out = n, A.avail_out = h, A.next_in = a, A.avail_in = r, e.hold = g, e.bits = o, At(A, _), n = A.next_out, s = A.output, h = A.avail_out, a = A.next_in, i = A.input, r = A.avail_in, g = e.hold, o = e.bits, 16191 === e.mode && (e.back = -1);
                    break
                }
                for (e.back = 0; S = e.lencode[g & (1 << e.lenbits) - 1], c = S >>> 24, C = S >>> 16 & 255, l = 65535 & S, !(c <= o);) {
                    if (0 === r) break A;
                    r--, g += i[a++] << o, o += 8
                }
                if (C && 0 == (240 & C)) {
                    for (d = c, Q = C, f = l; S = e.lencode[f + ((g & (1 << d + Q) - 1) >> d)], c = S >>> 24, C = S >>> 16 & 255, l = 65535 & S, !(d + c <= o);) {
                        if (0 === r) break A;
                        r--, g += i[a++] << o, o += 8
                    }
                    g >>>= d, o -= d, e.back += d
                }
                if (g >>>= c, o -= c, e.back += c, e.length = l, 0 === C) {
                    e.mode = 16205;
                    break
                }
                if (32 & C) {
                    e.back = -1, e.mode = 16191;
                    break
                }
                if (64 & C) {
                    A.msg = "invalid literal/length code", e.mode = Ct;
                    break
                }
                e.extra = 15 & C, e.mode = 16201;
            case 16201:
                if (e.extra) {
                    for (p = e.extra; o < p;) {
                        if (0 === r) break A;
                        r--, g += i[a++] << o, o += 8
                    }
                    e.length += g & (1 << e.extra) - 1, g >>>= e.extra, o -= e.extra, e.back += e.extra
                }
                e.was = e.length, e.mode = 16202;
            case 16202:
                for (; S = e.distcode[g & (1 << e.distbits) - 1], c = S >>> 24, C = S >>> 16 & 255, l = 65535 & S, !(c <= o);) {
                    if (0 === r) break A;
                    r--, g += i[a++] << o, o += 8
                }
                if (0 == (240 & C)) {
                    for (d = c, Q = C, f = l; S = e.distcode[f + ((g & (1 << d + Q) - 1) >> d)], c = S >>> 24, C = S >>> 16 & 255, l = 65535 & S, !(d + c <= o);) {
                        if (0 === r) break A;
                        r--, g += i[a++] << o, o += 8
                    }
                    g >>>= d, o -= d, e.back += d
                }
                if (g >>>= c, o -= c, e.back += c, 64 & C) {
                    A.msg = "invalid distance code", e.mode = Ct;
                    break
                }
                e.offset = l, e.extra = 15 & C, e.mode = 16203;
            case 16203:
                if (e.extra) {
                    for (p = e.extra; o < p;) {
                        if (0 === r) break A;
                        r--, g += i[a++] << o, o += 8
                    }
                    e.offset += g & (1 << e.extra) - 1, g >>>= e.extra, o -= e.extra, e.back += e.extra
                }
                if (e.offset > e.dmax) {
                    A.msg = "invalid distance too far back", e.mode = Ct;
                    break
                }
                e.mode = 16204;
            case 16204:
                if (0 === h) break A;
                if (w = _ - h, e.offset > w) {
                    if (w = e.offset - w, w > e.whave && e.sane) {
                        A.msg = "invalid distance too far back", e.mode = Ct;
                        break
                    }
                    w > e.wnext ? (w -= e.wnext, B = e.wsize - w) : B = e.wnext - w, w > e.length && (w = e.length), I = e.window
                } else I = s, B = n - e.offset, w = e.length;
                w > h && (w = h), h -= w, e.length -= w;
                do {
                    s[n++] = I[B++]
                } while (--w);
                0 === e.length && (e.mode = 16200);
                break;
            case 16205:
                if (0 === h) break A;
                s[n++] = e.length, h--, e.mode = 16200;
                break;
            case 16206:
                if (e.wrap) {
                    for (; o < 32;) {
                        if (0 === r) break A;
                        r--, g |= i[a++] << o, o += 8
                    }
                    if (_ -= h, A.total_out += _, e.total += _, 4 & e.wrap && _ && (A.adler = e.check = e.flags ? K(e.check, s, _, n - _) : T(e.check, s, _, n - _)), _ = h, 4 & e.wrap && (e.flags ? g : lt(g)) !== e.check) {
                        A.msg = "incorrect data check", e.mode = Ct;
                        break
                    }
                    g = 0, o = 0
                }
                e.mode = 16207;
            case 16207:
                if (e.wrap && e.flags) {
                    for (; o < 32;) {
                        if (0 === r) break A;
                        r--, g += i[a++] << o, o += 8
                    }
                    if (4 & e.wrap && g !== (4294967295 & e.total)) {
                        A.msg = "incorrect length check", e.mode = Ct;
                        break
                    }
                    g = 0, o = 0
                }
                e.mode = 16208;
            case 16208:
                M = ot;
                break A;
            case Ct:
                M = wt;
                break A;
            case 16210:
                return Bt;
            default:
                return _t
        }
        return A.next_out = n, A.avail_out = h, A.next_in = a, A.avail_in = r, e.hold = g, e.bits = o, (e.wsize || _ !== A.avail_out && e.mode < Ct && (e.mode < 16206 || t !== nt)) && mt(A, A.output, A.next_out, _ - A.avail_out), E -= A.avail_in, _ -= A.avail_out, A.total_in += E, A.total_out += _, e.total += _, 4 & e.wrap && _ && (A.adler = e.check = e.flags ? K(e.check, s, _, A.next_out - _) : T(e.check, s, _, A.next_out - _)), A.data_type = e.bits + (e.last ? 64 : 0) + (16191 === e.mode ? 128 : 0) + (16199 === e.mode || 16194 === e.mode ? 256 : 0), (0 === E && 0 === _ || t === nt) && M === gt && (M = It), M
    },
    inflateEnd: A => {
        if (Qt(A)) return _t;
        let t = A.state;
        return t.window && (t.window = null), A.state = null, gt
    },
    inflateGetHeader: (A, t) => {
        if (Qt(A)) return _t;
        const e = A.state;
        return 0 == (2 & e.wrap) ? _t : (e.head = t, t.done = !1, gt)
    },
    inflateSetDictionary: (A, t) => {
        const e = t.length;
        let i, s, a;
        return Qt(A) ? _t : (i = A.state, 0 !== i.wrap && 16190 !== i.mode ? _t : 16190 === i.mode && (s = 1, s = T(s, t, e, 0), s !== i.check) ? wt : (a = mt(A, t, e, e), a ? (i.mode = 16210, Bt) : (i.havedict = 1, gt)))
    },
    inflateInfo: "pako inflate (from Nodeca project)"
};
var Ft = function () {
    this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1
};
const bt = Object.prototype.toString,
    {
        Z_NO_FLUSH: Ht,
        Z_FINISH: Gt,
        Z_OK: Tt,
        Z_STREAM_END: Pt,
        Z_NEED_DICT: Kt,
        Z_STREAM_ERROR: Yt,
        Z_DATA_ERROR: xt,
        Z_MEM_ERROR: Ot
    } = x;

function Ut(A) {
    this.options = HA({
        chunkSize: 65536,
        windowBits: 15,
        to: ""
    }, A || {});
    const t = this.options;
    t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)), !(t.windowBits >= 0 && t.windowBits < 16) || A && A.windowBits || (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && 0 == (15 & t.windowBits) && (t.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new OA, this.strm.avail_out = 0;
    let e = kt.inflateInit2(this.strm, t.windowBits);
    if (e !== Tt) throw new Error(Y[e]);
    if (this.header = new Ft, kt.inflateGetHeader(this.strm, this.header), t.dictionary && ("string" == typeof t.dictionary ? t.dictionary = KA(t.dictionary) : "[object ArrayBuffer]" === bt.call(t.dictionary) && (t.dictionary = new Uint8Array(t.dictionary)), t.raw && (e = kt.inflateSetDictionary(this.strm, t.dictionary), e !== Tt))) throw new Error(Y[e])
}

function vt(A, t) {
    const e = new Ut(t);
    if (e.push(A), e.err) throw e.msg || Y[e.err];
    return e.result
}
Ut.prototype.push = function (A, t) {
    const e = this.strm,
        i = this.options.chunkSize,
        s = this.options.dictionary;
    let a, n, r;
    if (this.ended) return !1;
    for (n = t === ~~t ? t : !0 === t ? Gt : Ht, "[object ArrayBuffer]" === bt.call(A) ? e.input = new Uint8Array(A) : e.input = A, e.next_in = 0, e.avail_in = e.input.length; ;) {
        for (0 === e.avail_out && (e.output = new Uint8Array(i), e.next_out = 0, e.avail_out = i), a = kt.inflate(e, n), a === Kt && s && (a = kt.inflateSetDictionary(e, s), a === Tt ? a = kt.inflate(e, n) : a === xt && (a = Kt)); e.avail_in > 0 && a === Pt && e.state.wrap > 0 && 0 !== A[e.next_in];) kt.inflateReset(e), a = kt.inflate(e, n);
        switch (a) {
            case Yt:
            case xt:
            case Kt:
            case Ot:
                return this.onEnd(a), this.ended = !0, !1
        }
        if (r = e.avail_out, e.next_out && (0 === e.avail_out || a === Pt))
            if ("string" === this.options.to) {
                let A = xA(e.output, e.next_out),
                    t = e.next_out - A,
                    s = YA(e.output, A);
                e.next_out = t, e.avail_out = i - t, t && e.output.set(e.output.subarray(A, A + t), 0), this.onData(s)
            } else this.onData(e.output.length === e.next_out ? e.output : e.output.subarray(0, e.next_out));
        if (a !== Tt || 0 !== r) {
            if (a === Pt) return a = kt.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, !0;
            if (0 === e.avail_in) break
        }
    }
    return !0
}, Ut.prototype.onData = function (A) {
    this.chunks.push(A)
}, Ut.prototype.onEnd = function (A) {
    A === Tt && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = GA(this.chunks)), this.chunks = [], this.err = A, this.msg = this.strm.msg
};
var Lt = {
    Inflate: Ut,
    inflate: vt,
    inflateRaw: function (A, t) {
        return (t = t || {}).raw = !0, vt(A, t)
    },
    ungzip: vt,
    constants: x
};
const {
    Deflate: Jt,
    deflate: zt,
    deflateRaw: Nt,
    gzip: Zt
} = $A, {
    Inflate: jt,
    inflate: Wt,
    inflateRaw: qt,
    ungzip: Xt
} = Lt;
var Vt = zt,
    $t = jt;

function Ae(A) {
    return new Promise((t => setTimeout(t, A)))
}
async function te(A, t) {
    const e = {
        D: async t => await A.setDTR(t),
        R: async t => await A.setRTS(t),
        W: async A => await Ae(A)
    };
    try {
        if (! function (A) {
            const t = ["D", "R", "W"],
                e = A.split("|");
            for (const A of e) {
                const e = A[0],
                    i = A.slice(1);
                if (!t.includes(e)) return !1;
                if ("D" === e || "R" === e) {
                    if ("0" !== i && "1" !== i) return !1
                } else if ("W" === e) {
                    const A = parseInt(i);
                    if (isNaN(A) || A <= 0) return !1
                }
            }
            return !0
        }(t)) return;
        const A = t.split("|");
        for (const t of A) {
            const A = t[0],
                i = t.slice(1);
            "W" === A ? await e.W(Number(i)) : "D" !== A && "R" !== A || await e[A]("1" === i)
        }
    } catch (A) {
        throw new Error("Invalid custom reset sequence")
    }
}
class ee {
    constructor(A) {
        this.ESP_RAM_BLOCK = 6144, this.ESP_FLASH_BEGIN = 2, this.ESP_FLASH_DATA = 3, this.ESP_FLASH_END = 4, this.ESP_MEM_BEGIN = 5, this.ESP_MEM_END = 6, this.ESP_MEM_DATA = 7, this.ESP_WRITE_REG = 9, this.ESP_READ_REG = 10, this.ESP_SPI_ATTACH = 13, this.ESP_CHANGE_BAUDRATE = 15, this.ESP_FLASH_DEFL_BEGIN = 16, this.ESP_FLASH_DEFL_DATA = 17, this.ESP_FLASH_DEFL_END = 18, this.ESP_SPI_FLASH_MD5 = 19, this.ESP_ERASE_FLASH = 208, this.ESP_ERASE_REGION = 209, this.ESP_RUN_USER_CODE = 211, this.ESP_IMAGE_MAGIC = 233, this.ESP_CHECKSUM_MAGIC = 239, this.ROM_INVALID_RECV_MSG = 5, this.ERASE_REGION_TIMEOUT_PER_MB = 3e4, this.ERASE_WRITE_TIMEOUT_PER_MB = 4e4, this.MD5_TIMEOUT_PER_MB = 8e3, this.CHIP_ERASE_TIMEOUT = 12e4, this.MAX_TIMEOUT = 2 * this.CHIP_ERASE_TIMEOUT, this.CHIP_DETECT_MAGIC_REG_ADDR = 1073745920, this.DETECTED_FLASH_SIZES = {
            18: "256KB",
            19: "512KB",
            20: "1MB",
            21: "2MB",
            22: "4MB",
            23: "8MB",
            24: "16MB"
        }, this.USB_JTAG_SERIAL_PID = 4097, this.romBaudrate = 115200, this.debugLogging = !1, this.checksum = function (A) {
            let t, e = 239;
            for (t = 0; t < A.length; t++) e ^= A[t];
            return e
        }, this.timeout_per_mb = function (A, t) {
            const e = A * (t / 1e6);
            return e < 3e3 ? 3e3 : e
        }, this.flash_size_bytes = function (A) {
            let t = -1;
            return -1 !== A.indexOf("KB") ? t = 1024 * parseInt(A.slice(0, A.indexOf("KB"))) : -1 !== A.indexOf("MB") && (t = 1024 * parseInt(A.slice(0, A.indexOf("MB"))) * 1024), t
        }, this.IS_STUB = !1, this.FLASH_WRITE_SIZE = 16384, this.transport = A.transport, this.baudrate = A.baudrate, A.romBaudrate && (this.romBaudrate = A.romBaudrate), A.terminal && (this.terminal = A.terminal, this.terminal.clean()), A.debugLogging && (this.debugLogging = A.debugLogging), this.info("esptool.js"), this.info("Serial port " + this.transport.get_info())
    }
    _sleep(A) {
        return new Promise((t => setTimeout(t, A)))
    }
    write(A, t = !0) {
        this.terminal ? t ? this.terminal.writeLine(A) : this.terminal.write(A) : console.log(A)
    }
    error(A, t = !0) {
        this.write(`Error: ${A}`, t)
    }
    info(A, t = !0) {
        this.write(A, t)
    }
    debug(A, t = !0) {
        this.debugLogging && this.write(`Debug: ${A}`, t)
    }
    _short_to_bytearray(A) {
        return new Uint8Array([255 & A, A >> 8 & 255])
    }
    _int_to_bytearray(A) {
        return new Uint8Array([255 & A, A >> 8 & 255, A >> 16 & 255, A >> 24 & 255])
    }
    _bytearray_to_short(A, t) {
        return A | t >> 8
    }
    _bytearray_to_int(A, t, e, i) {
        return A | t << 8 | e << 16 | i << 24
    }
    _appendBuffer(A, t) {
        const e = new Uint8Array(A.byteLength + t.byteLength);
        return e.set(new Uint8Array(A), 0), e.set(new Uint8Array(t), A.byteLength), e.buffer
    }
    _appendArray(A, t) {
        const e = new Uint8Array(A.length + t.length);
        return e.set(A, 0), e.set(t, A.length), e
    }
    ui8ToBstr(A) {
        let t = "";
        for (let e = 0; e < A.length; e++) t += String.fromCharCode(A[e]);
        return t
    }
    bstrToUi8(A) {
        const t = new Uint8Array(A.length);
        for (let e = 0; e < A.length; e++) t[e] = A.charCodeAt(e);
        return t
    }
    async flush_input() {
        try {
            await this.transport.rawRead(200)
        } catch (A) {
            this.error(A.message)
        }
    }
    async command(t = null, e = new Uint8Array(0), i = 0, s = !0, a = 3e3) {
        if (null != t) {
            const A = new Uint8Array(8 + e.length);
            let s;
            for (A[0] = 0, A[1] = t, A[2] = this._short_to_bytearray(e.length)[0], A[3] = this._short_to_bytearray(e.length)[1], A[4] = this._int_to_bytearray(i)[0], A[5] = this._int_to_bytearray(i)[1], A[6] = this._int_to_bytearray(i)[2], A[7] = this._int_to_bytearray(i)[3], s = 0; s < e.length; s++) A[8 + s] = e[s];
            await this.transport.write(A)
        }
        if (!s) return [0, new Uint8Array(0)];
        for (let e = 0; e < 100; e++) {
            const e = await this.transport.read(a),
                i = e[0],
                s = e[1],
                n = this._bytearray_to_int(e[4], e[5], e[6], e[7]),
                r = e.slice(8);
            if (1 == i) {
                if (null == t || s == t) return [n, r];
                if (0 != r[0] && r[1] == this.ROM_INVALID_RECV_MSG) throw await this.flush_input(), new A("unsupported command error")
            }
        }
        throw new A("invalid response")
    }
    async read_reg(A, t = 3e3) {
        const e = this._int_to_bytearray(A);
        return (await this.command(this.ESP_READ_REG, e, void 0, void 0, t))[0]
    }
    async write_reg(A, t, e = 4294967295, i = 0, s = 0) {
        let a = this._appendArray(this._int_to_bytearray(A), this._int_to_bytearray(t));
        a = this._appendArray(a, this._int_to_bytearray(e)), a = this._appendArray(a, this._int_to_bytearray(i)), s > 0 && (a = this._appendArray(a, this._int_to_bytearray(this.chip.UART_DATE_REG_ADDR)), a = this._appendArray(a, this._int_to_bytearray(0)), a = this._appendArray(a, this._int_to_bytearray(0)), a = this._appendArray(a, this._int_to_bytearray(s))), await this.check_command("write target memory", this.ESP_WRITE_REG, a)
    }
    async sync() {
        this.debug("Sync");
        const A = new Uint8Array(36);
        let t;
        for (A[0] = 7, A[1] = 7, A[2] = 18, A[3] = 32, t = 0; t < 32; t++) A[4 + t] = 85;
        try {
            return await this.command(8, A, void 0, void 0, 100)
        } catch (A) {
            throw this.debug("Sync err " + A), A
        }
    }
    async _connect_attempt(A = "default_reset", t = !1) {
        if (this.debug("_connect_attempt " + A + " " + t), "no_reset" !== A)
            if (this.transport.get_pid() === this.USB_JTAG_SERIAL_PID) await async function (A) {
                await A.setRTS(!1), await A.setDTR(!1), await Ae(100), await A.setDTR(!0), await A.setRTS(!1), await Ae(100), await A.setRTS(!0), await A.setDTR(!1), await A.setRTS(!0), await Ae(100), await A.setRTS(!1), await A.setDTR(!1)
            }(this.transport);
            else {
                const A = t ? "D0|R1|W100|W2000|D1|R0|W50|D0" : "D0|R1|W100|D1|R0|W50|D0";
                await te(this.transport, A)
            } let e = 0,
                i = !0;
        for (; i;) {
            try {
                e += (await this.transport.read(1e3)).length
            } catch (A) {
                if (this.debug(A.message), A instanceof Error) {
                    i = !1;
                    break
                }
            }
            await this._sleep(50)
        }
        for (this.transport.slip_reader_enabled = !0, e = 7; e--;) {
            try {
                const A = await this.sync();
                return this.debug(A[0].toString()), "success"
            } catch (A) {
                A instanceof Error && (t ? this.info("_", !1) : this.info(".", !1))
            }
            await this._sleep(50)
        }
        return "error"
    }
    async connect(t = "default_reset", e = 7, i = !1) {
        let s, a;
        for (this.info("Connecting...", !1), await this.transport.connect(this.romBaudrate), s = 0; s < e && (a = await this._connect_attempt(t, !1), "success" !== a) && (a = await this._connect_attempt(t, !0), "success" !== a); s++);
        if ("success" !== a) throw new A("Failed to connect with the device");
        if (this.info("\n\r", !1), !i) {
            const t = await this.read_reg(1073745920) >>> 0;
            this.debug("Chip Magic " + t.toString(16));
            const e = await async function (A) {
                switch (A) {
                    case 15736195: {
                        const {
                            ESP32ROM: A
                        } = await Promise.resolve().then((function () {
                            return oe
                        }));
                        return new A
                    }
                    case 1763790959:
                    case 456216687: {
                        const {
                            ESP32C3ROM: A
                        } = await Promise.resolve().then((function () {
                            return ce
                        }));
                        return new A
                    }
                    case 752910447: {
                        const {
                            ESP32C6ROM: A
                        } = await Promise.resolve().then((function () {
                            return De
                        }));
                        return new A
                    }
                    case 3619110528: {
                        const {
                            ESP32H2ROM: A
                        } = await Promise.resolve().then((function () {
                            return ye
                        }));
                        return new A
                    }
                    case 9: {
                        const {
                            ESP32S3ROM: A
                        } = await Promise.resolve().then((function () {
                            return Ge
                        }));
                        return new A
                    }
                    case 1990: {
                        const {
                            ESP32S2ROM: A
                        } = await Promise.resolve().then((function () {
                            return Oe
                        }));
                        return new A
                    }
                    case 4293968129: {
                        const {
                            ESP8266ROM: A
                        } = await Promise.resolve().then((function () {
                            return Ne
                        }));
                        return new A
                    }
                    default:
                        return null
                }
            }(t);
            if (null === this.chip) throw new A(`Unexpected CHIP magic value ${t}. Failed to autodetect chip type.`);
            this.chip = e
        }
    }
    async detect_chip(A = "default_reset") {
        await this.connect(A), this.info("Detecting chip type... ", !1), null != this.chip ? this.info(this.chip.CHIP_NAME) : this.info("unknown!")
    }
    async check_command(A = "", t = null, e = new Uint8Array(0), i = 0, s = 3e3) {
        this.debug("check_command " + A);
        const a = await this.command(t, e, i, void 0, s);
        return a[1].length > 4 ? a[1] : a[0]
    }
    async mem_begin(A, t, e, i) {
        this.debug("mem_begin " + A + " " + t + " " + e + " " + i.toString(16));
        let s = this._appendArray(this._int_to_bytearray(A), this._int_to_bytearray(t));
        s = this._appendArray(s, this._int_to_bytearray(e)), s = this._appendArray(s, this._int_to_bytearray(i)), await this.check_command("enter RAM download mode", this.ESP_MEM_BEGIN, s)
    }
    async mem_block(A, t) {
        let e = this._appendArray(this._int_to_bytearray(A.length), this._int_to_bytearray(t));
        e = this._appendArray(e, this._int_to_bytearray(0)), e = this._appendArray(e, this._int_to_bytearray(0)), e = this._appendArray(e, A);
        const i = this.checksum(A);
        await this.check_command("write to target RAM", this.ESP_MEM_DATA, e, i)
    }
    async mem_finish(A) {
        const t = 0 === A ? 1 : 0,
            e = this._appendArray(this._int_to_bytearray(t), this._int_to_bytearray(A));
        await this.check_command("leave RAM download mode", this.ESP_MEM_END, e, void 0, 50)
    }
    async flash_spi_attach(A) {
        const t = this._int_to_bytearray(A);
        await this.check_command("configure SPI flash pins", this.ESP_SPI_ATTACH, t)
    }
    async flash_begin(A, t) {
        const e = Math.floor((A + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE),
            i = this.chip.get_erase_size(t, A),
            s = new Date,
            a = s.getTime();
        let n = 3e3;
        0 == this.IS_STUB && (n = this.timeout_per_mb(this.ERASE_REGION_TIMEOUT_PER_MB, A)), this.debug("flash begin " + i + " " + e + " " + this.FLASH_WRITE_SIZE + " " + t + " " + A);
        let r = this._appendArray(this._int_to_bytearray(i), this._int_to_bytearray(e));
        r = this._appendArray(r, this._int_to_bytearray(this.FLASH_WRITE_SIZE)), r = this._appendArray(r, this._int_to_bytearray(t)), 0 == this.IS_STUB && (r = this._appendArray(r, this._int_to_bytearray(0))), await this.check_command("enter Flash download mode", this.ESP_FLASH_BEGIN, r, void 0, n);
        const h = s.getTime();
        return 0 != A && 0 == this.IS_STUB && this.info("Took " + (h - a) / 1e3 + "." + (h - a) % 1e3 + "s to erase flash block"), e
    }
    async flash_defl_begin(A, t, e) {
        const i = Math.floor((t + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE),
            s = Math.floor((A + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE),
            a = new Date,
            n = a.getTime();
        let r, h;
        this.IS_STUB ? (r = A, h = 3e3) : (r = s * this.FLASH_WRITE_SIZE, h = this.timeout_per_mb(this.ERASE_REGION_TIMEOUT_PER_MB, r)), this.info("Compressed " + A + " bytes to " + t + "...");
        let g = this._appendArray(this._int_to_bytearray(r), this._int_to_bytearray(i));
        g = this._appendArray(g, this._int_to_bytearray(this.FLASH_WRITE_SIZE)), g = this._appendArray(g, this._int_to_bytearray(e)), "ESP32-S2" !== this.chip.CHIP_NAME && "ESP32-S3" !== this.chip.CHIP_NAME && "ESP32-C3" !== this.chip.CHIP_NAME || !1 !== this.IS_STUB || (g = this._appendArray(g, this._int_to_bytearray(0))), await this.check_command("enter compressed flash mode", this.ESP_FLASH_DEFL_BEGIN, g, void 0, h);
        const o = a.getTime();
        return 0 != A && !1 === this.IS_STUB && this.info("Took " + (o - n) / 1e3 + "." + (o - n) % 1e3 + "s to erase flash block"), i
    }
    async flash_block(A, t, e) {
        let i = this._appendArray(this._int_to_bytearray(A.length), this._int_to_bytearray(t));
        i = this._appendArray(i, this._int_to_bytearray(0)), i = this._appendArray(i, this._int_to_bytearray(0)), i = this._appendArray(i, A);
        const s = this.checksum(A);
        await this.check_command("write to target Flash after seq " + t, this.ESP_FLASH_DATA, i, s, e)
    }
    async flash_defl_block(A, t, e) {
        let i = this._appendArray(this._int_to_bytearray(A.length), this._int_to_bytearray(t));
        i = this._appendArray(i, this._int_to_bytearray(0)), i = this._appendArray(i, this._int_to_bytearray(0)), i = this._appendArray(i, A);
        const s = this.checksum(A);
        this.debug("flash_defl_block " + A[0].toString(16) + " " + A[1].toString(16)), await this.check_command("write compressed data to flash after seq " + t, this.ESP_FLASH_DEFL_DATA, i, s, e)
    }
    async flash_finish(A = !1) {
        const t = A ? 0 : 1,
            e = this._int_to_bytearray(t);
        await this.check_command("leave Flash mode", this.ESP_FLASH_END, e)
    }
    async flash_defl_finish(A = !1) {
        const t = A ? 0 : 1,
            e = this._int_to_bytearray(t);
        await this.check_command("leave compressed flash mode", this.ESP_FLASH_DEFL_END, e)
    }
    async run_spiflash_command(t, e, i) {
        const s = this.chip.SPI_REG_BASE,
            a = s + 0,
            n = s + this.chip.SPI_USR_OFFS,
            r = s + this.chip.SPI_USR1_OFFS,
            h = s + this.chip.SPI_USR2_OFFS,
            g = s + this.chip.SPI_W0_OFFS;
        let o;
        o = null != this.chip.SPI_MOSI_DLEN_OFFS ? async (A, t) => {
            const e = s + this.chip.SPI_MOSI_DLEN_OFFS,
                i = s + this.chip.SPI_MISO_DLEN_OFFS;
            A > 0 && await this.write_reg(e, A - 1), t > 0 && await this.write_reg(i, t - 1)
        } : async (A, t) => {
            const e = r,
                i = (0 === t ? 0 : t - 1) << 8 | (0 === A ? 0 : A - 1) << 17;
            await this.write_reg(e, i)
        };
        const E = 1 << 18;
        if (i > 32) throw new A("Reading more than 32 bits back from a SPI flash operation is unsupported");
        if (e.length > 64) throw new A("Writing more than 64 bytes of data with one SPI command is unsupported");
        const _ = 8 * e.length,
            w = await this.read_reg(n),
            B = await this.read_reg(h);
        let I, c = 1 << 31;
        i > 0 && (c |= 268435456), _ > 0 && (c |= 134217728), await o(_, i), await this.write_reg(n, c);
        let C = 7 << 28 | t;
        if (await this.write_reg(h, C), 0 == _) await this.write_reg(g, 0);
        else {
            if (e.length % 4 != 0) {
                const A = new Uint8Array(e.length % 4);
                e = this._appendArray(e, A)
            }
            let A = g;
            for (I = 0; I < e.length - 4; I += 4) C = this._bytearray_to_int(e[I], e[I + 1], e[I + 2], e[I + 3]), await this.write_reg(A, C), A += 4
        }
        for (await this.write_reg(a, E), I = 0; I < 10 && (C = await this.read_reg(a) & E, 0 != C); I++);
        if (10 === I) throw new A("SPI command did not complete in time");
        const l = await this.read_reg(g);
        return await this.write_reg(n, w), await this.write_reg(h, B), l
    }
    async read_flash_id() {
        const A = new Uint8Array(0);
        return await this.run_spiflash_command(159, A, 24)
    }
    async erase_flash() {
        this.info("Erasing flash (this may take a while)...");
        let A = new Date;
        const t = A.getTime(),
            e = await this.check_command("erase flash", this.ESP_ERASE_FLASH, void 0, void 0, this.CHIP_ERASE_TIMEOUT);
        A = new Date;
        const i = A.getTime();
        return this.info("Chip erase completed successfully in " + (i - t) / 1e3 + "s"), e
    }
    toHex(A) {
        return Array.prototype.map.call(A, (A => ("00" + A.toString(16)).slice(-2))).join("")
    }
    async flash_md5sum(A, t) {
        const e = this.timeout_per_mb(this.MD5_TIMEOUT_PER_MB, t);
        let i = this._appendArray(this._int_to_bytearray(A), this._int_to_bytearray(t));
        i = this._appendArray(i, this._int_to_bytearray(0)), i = this._appendArray(i, this._int_to_bytearray(0));
        let s = await this.check_command("calculate md5sum", this.ESP_SPI_FLASH_MD5, i, void 0, e);
        s instanceof Uint8Array && s.length > 16 && (s = s.slice(0, 16));
        return this.toHex(s)
    }
    async run_stub() {
        this.info("Uploading stub...");
        let t = atob(this.chip.ROM_TEXT),
            e = t.split("").map((function (A) {
                return A.charCodeAt(0)
            }));
        const i = new Uint8Array(e);
        t = atob(this.chip.ROM_DATA), e = t.split("").map((function (A) {
            return A.charCodeAt(0)
        }));
        const s = new Uint8Array(e);
        let a, n = Math.floor((i.length + this.ESP_RAM_BLOCK - 1) / this.ESP_RAM_BLOCK);
        for (await this.mem_begin(i.length, n, this.ESP_RAM_BLOCK, this.chip.TEXT_START), a = 0; a < n; a++) {
            const A = a * this.ESP_RAM_BLOCK,
                t = A + this.ESP_RAM_BLOCK;
            await this.mem_block(i.slice(A, t), a)
        }
        for (n = Math.floor((s.length + this.ESP_RAM_BLOCK - 1) / this.ESP_RAM_BLOCK), await this.mem_begin(s.length, n, this.ESP_RAM_BLOCK, this.chip.DATA_START), a = 0; a < n; a++) {
            const A = a * this.ESP_RAM_BLOCK,
                t = A + this.ESP_RAM_BLOCK;
            await this.mem_block(s.slice(A, t), a)
        }
        this.info("Running stub..."), await this.mem_finish(this.chip.ENTRY);
        for (let A = 0; A < 100; A++) {
            const A = await this.transport.read(1e3, 6);
            if (79 === A[0] && 72 === A[1] && 65 === A[2] && 73 === A[3]) return this.info("Stub running..."), this.IS_STUB = !0, this.FLASH_WRITE_SIZE = 16384, this.chip
        }
        throw new A("Failed to start stub. Unexpected response")
    }
    async change_baud() {
        this.info("Changing baudrate to " + this.baudrate);
        const A = this.IS_STUB ? this.transport.baudrate : 0,
            t = this._appendArray(this._int_to_bytearray(this.baudrate), this._int_to_bytearray(A)),
            e = await this.command(this.ESP_CHANGE_BAUDRATE, t);
        this.debug(e[0].toString()), this.info("Changed"), await this.transport.disconnect(), await this._sleep(50), await this.transport.connect(this.baudrate);
        try {
            await this.transport.rawRead(500)
        } catch (A) {
            this.debug(A.message)
        }
    }
    async main_fn(A = "default_reset") {
        await this.detect_chip(A);
        const t = await this.chip.get_chip_description(this);
        return this.info("Chip is " + t), this.info("Features: " + await this.chip.get_chip_features(this)), this.info("Crystal is " + await this.chip.get_crystal_freq(this) + "MHz"), this.info("MAC: " + await this.chip.read_mac(this)), await this.chip.read_mac(this), void 0 !== this.chip._post_connect && await this.chip._post_connect(this), await this.run_stub(), this.romBaudrate !== this.baudrate && await this.change_baud(), t
    }
    parse_flash_size_arg(t) {
        if (void 0 === this.chip.FLASH_SIZES[t]) throw new A("Flash size " + t + " is not supported by this chip type. Supported sizes: " + this.chip.FLASH_SIZES);
        return this.chip.FLASH_SIZES[t]
    }
    _update_image_flash_params(A, t, e, i, s) {
        if (this.debug("_update_image_flash_params " + e + " " + i + " " + s), A.length < 8) return A;
        if (t != this.chip.BOOTLOADER_FLASH_OFFSET) return A;
        if ("keep" === e && "keep" === i && "keep" === s) return this.info("Not changing the image"), A;
        const a = parseInt(A[0]);
        let n = parseInt(A[2]);
        const r = parseInt(A[3]);
        if (a !== this.ESP_IMAGE_MAGIC) return this.info("Warning: Image file at 0x" + t.toString(16) + " doesn't look like an image file, so not changing any flash settings."), A;
        if ("keep" !== i) {
            n = {
                qio: 0,
                qout: 1,
                dio: 2,
                dout: 3
            }[i]
        }
        let h = 15 & r;
        if ("keep" !== s) {
            h = {
                "40m": 0,
                "26m": 1,
                "20m": 2,
                "80m": 15
            }[s]
        }
        let g = 240 & r;
        "keep" !== e && (g = this.parse_flash_size_arg(e));
        const o = n << 8 | h + g;
        return this.info("Flash params set to " + o.toString(16)), parseInt(A[2]) !== n << 8 && (A = A.substring(0, 2) + (n << 8).toString() + A.substring(3)), parseInt(A[3]) !== h + g && (A = A.substring(0, 3) + (h + g).toString() + A.substring(4)), A
    }
    async write_flash(t) {
        if (this.debug("EspLoader program"), "keep" !== t.flashSize) {
            const e = this.flash_size_bytes(t.flashSize);
            for (let i = 0; i < t.fileArray.length; i++)
                if (t.fileArray[i].data.length + t.fileArray[i].address > e) throw new A(`File ${i + 1} doesn't fit in the available flash`)
        }
        let e, i;
        !0 === this.IS_STUB && !0 === t.eraseAll && await this.erase_flash();
        for (let s = 0; s < t.fileArray.length; s++) {
            this.debug("Data Length " + t.fileArray[s].data.length), e = t.fileArray[s].data;
            const a = t.fileArray[s].data.length % 4;
            if (a > 0 && (e += "ÿÿÿÿ".substring(4 - a)), i = t.fileArray[s].address, this.debug("Image Length " + e.length), 0 === e.length) {
                this.debug("Warning: File is empty");
                continue
            }
            e = this._update_image_flash_params(e, i, t.flashSize, t.flashMode, t.flashFreq);
            let n = null;
            t.calculateMD5Hash && (n = t.calculateMD5Hash(e), this.debug("Image MD5 " + n));
            const r = e.length;
            let h;
            if (t.compress) {
                const A = this.bstrToUi8(e);
                e = this.ui8ToBstr(Vt(A, {
                    level: 9
                })), h = await this.flash_defl_begin(r, e.length, i)
            } else h = await this.flash_begin(r, i);
            let g = 0,
                o = 0;
            const E = e.length;
            t.reportProgress && t.reportProgress(s, 0, E);
            let _ = new Date;
            const w = _.getTime();
            let B = 5e3;
            const I = new $t({
                chunkSize: 1
            });
            let c = 0;
            for (I.onData = function (A) {
                c += A.byteLength
            }; e.length > 0;) {
                this.debug("Write loop " + i + " " + g + " " + h), this.info("Writing at 0x" + (i + c).toString(16) + "... (" + Math.floor(100 * (g + 1) / h) + "%)");
                const a = this.bstrToUi8(e.slice(0, this.FLASH_WRITE_SIZE));
                if (!t.compress) throw new A("Yet to handle Non Compressed writes");
                {
                    const A = c;
                    I.push(a, !1);
                    const t = c - A;
                    let e = 3e3;
                    this.timeout_per_mb(this.ERASE_WRITE_TIMEOUT_PER_MB, t) > 3e3 && (e = this.timeout_per_mb(this.ERASE_WRITE_TIMEOUT_PER_MB, t)), !1 === this.IS_STUB && (B = e), await this.flash_defl_block(a, g, B), this.IS_STUB && (B = e)
                }
                o += a.length, e = e.slice(this.FLASH_WRITE_SIZE, e.length), g++, t.reportProgress && t.reportProgress(s, o, E)
            }
            this.IS_STUB && await this.read_reg(this.CHIP_DETECT_MAGIC_REG_ADDR, B), _ = new Date;
            const C = _.getTime() - w;
            if (t.compress && this.info("Wrote " + r + " bytes (" + o + " compressed) at 0x" + i.toString(16) + " in " + C / 1e3 + " seconds."), n) {
                const t = await this.flash_md5sum(i, r);
                if (new String(t).valueOf() != new String(n).valueOf()) throw this.info("File  md5: " + n), this.info("Flash md5: " + t), new A("MD5 of file does not match data in flash!");
                this.info("Hash of data verified.")
            }
        }
        this.info("Leaving..."), this.IS_STUB && (await this.flash_begin(0, 0), t.compress ? await this.flash_defl_finish() : await this.flash_finish())
    }
    async flash_id() {
        this.debug("flash_id");
        const A = await this.read_flash_id();
        this.info("Manufacturer: " + (255 & A).toString(16));
        const t = A >> 16 & 255;
        this.info("Device: " + (A >> 8 & 255).toString(16) + t.toString(16)), this.info("Detected flash size: " + this.DETECTED_FLASH_SIZES[t])
    }
    async hard_reset() {
        await this.transport.setRTS(!0), await this._sleep(100), await this.transport.setRTS(!1)
    }
    async soft_reset() {
        if (this.IS_STUB) {
            if ("ESP8266" != this.chip.CHIP_NAME) throw new A("Soft resetting is currently only supported on ESP8266");
            await this.command(this.ESP_RUN_USER_CODE, void 0, void 0, !1)
        } else await this.flash_begin(0, 0), await this.flash_finish(!1)
    }
}
class ie {
    constructor(A) {
        this.device = A, this.slip_reader_enabled = !1, this.left_over = new Uint8Array(0), this.baudrate = 0, this._DTR_state = !1
    }
    get_info() {
        const A = this.device.getInfo();
        return A.usbVendorId && A.usbProductId ? `WebSerial VendorID 0x${A.usbVendorId.toString(16)} ProductID 0x${A.usbProductId.toString(16)}` : ""
    }
    get_pid() {
        return this.device.getInfo().usbProductId
    }
    slip_writer(A) {
        let t = 0,
            e = 0,
            i = 0;
        for (e = 0; e < A.length; e++) 192 !== A[e] && 219 !== A[e] || t++;
        const s = new Uint8Array(2 + t + A.length);
        for (s[0] = 192, i = 1, e = 0; e < A.length; e++, i++) 192 !== A[e] ? 219 !== A[e] ? s[i] = A[e] : (s[i++] = 219, s[i] = 221) : (s[i++] = 219, s[i] = 220);
        return s[i] = 192, s
    }
    async write(A) {
        const t = this.slip_writer(A);
        if (this.device.writable) {
            const A = this.device.writable.getWriter();
            await A.write(t), A.releaseLock()
        }
    }
    _appendBuffer(A, t) {
        const e = new Uint8Array(A.byteLength + t.byteLength);
        return e.set(new Uint8Array(A), 0), e.set(new Uint8Array(t), A.byteLength), e.buffer
    }
    slip_reader(A) {
        let t = 0,
            e = 0,
            i = 0,
            s = "init";
        for (; t < A.length;)
            if ("init" !== s || 192 != A[t]) {
                if ("valid_data" === s && 192 == A[t]) {
                    i = t - 1, s = "packet_complete";
                    break
                }
                t++
            } else e = t + 1, s = "valid_data", t++;
        if ("packet_complete" !== s) return this.left_over = A, new Uint8Array(0);
        this.left_over = A.slice(i + 2);
        const a = new Uint8Array(i - e + 1);
        let n = 0;
        for (t = e; t <= i; t++, n++) 219 !== A[t] || 220 !== A[t + 1] ? 219 !== A[t] || 221 !== A[t + 1] ? a[n] = A[t] : (a[n] = 219, t++) : (a[n] = 192, t++);
        return a.slice(0, n)
    }
    async read(A = 0, t = 12) {
        let e, i = this.left_over;
        if (this.left_over = new Uint8Array(0), this.slip_reader_enabled) {
            const A = this.slip_reader(i);
            if (A.length > 0) return A;
            i = this.left_over, this.left_over = new Uint8Array(0)
        }
        if (null == this.device.readable) return this.left_over;
        const s = this.device.readable.getReader();
        try {
            A > 0 && (e = setTimeout((function () {
                s.cancel()
            }), A));
            do {
                const {
                    value: A,
                    done: t
                } = await s.read();
                if (t) throw this.left_over = i, new Error("Timeout");
                i = new Uint8Array(this._appendBuffer(i.buffer, A.buffer))
            } while (i.length < t)
        } finally {
            A > 0 && clearTimeout(e), s.releaseLock()
        }
        return this.slip_reader_enabled ? this.slip_reader(i) : i
    }
    async rawRead(A = 0) {
        if (0 != this.left_over.length) {
            const A = this.left_over;
            return this.left_over = new Uint8Array(0), A
        }
        if (!this.device.readable) return this.left_over;
        const t = this.device.readable.getReader();
        let e;
        try {
            A > 0 && (e = setTimeout((function () {
                t.cancel()
            }), A));
            const {
                value: i,
                done: s
            } = await t.read();
            if (s) throw new Error("Timeout");
            return i
        } finally {
            A > 0 && clearTimeout(e), t.releaseLock()
        }
    }
    async setRTS(A) {
        await this.device.setSignals({
            requestToSend: A
        }), await this.setDTR(this._DTR_state)
    }
    async setDTR(A) {
        this._DTR_state = A, await this.device.setSignals({
            dataTerminalReady: A
        })
    }
    async connect(A = 115200) {
        await this.device.open({
            baudRate: A
        }), this.baudrate = A, this.left_over = new Uint8Array(0)
    }
    async sleep(A) {
        return new Promise((t => setTimeout(t, A)))
    }
    async waitForUnlock(A) {
        for (; this.device.readable && this.device.readable.locked || this.device.writable && this.device.writable.locked;) await this.sleep(A)
    }
    async disconnect() {
        await this.waitForUnlock(400), await this.device.close()
    }
}
class se {
    get_erase_size(A, t) {
        return t
    }
}
var ae = 1074521560,
    ne = "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",
    re = 1074520064,
    he = "GOv8P9jnC0Bx6AtA8+wLQO3oC0CP6AtA7egLQEnpC0AG6gtAeOoLQCHqC0CB5wtAo+kLQPjpC0Bn6QtAmuoLQI7pC0Ca6gtAXegLQLPoC0Dt6AtASekLQHfoC0BM6wtAs+wLQKXmC0DX7AtApeYLQKXmC0Cl5gtApeYLQKXmC0Cl5gtApeYLQKXmC0Dz6gtApeYLQM3rC0Cz7AtA",
    ge = 1073605544;
var oe = Object.freeze({
    __proto__: null,
    ESP32ROM: class extends se {
        constructor() {
            super(...arguments), this.CHIP_NAME = "ESP32", this.IMAGE_CHIP_ID = 0, this.EFUSE_RD_REG_BASE = 1073061888, this.DR_REG_SYSCON_BASE = 1073111040, this.UART_CLKDIV_REG = 1072955412, this.UART_CLKDIV_MASK = 1048575, this.UART_DATE_REG_ADDR = 1610612856, this.XTAL_CLK_DIVIDER = 1, this.FLASH_SIZES = {
                "1MB": 0,
                "2MB": 16,
                "4MB": 32,
                "8MB": 48,
                "16MB": 64
            }, this.FLASH_WRITE_SIZE = 1024, this.BOOTLOADER_FLASH_OFFSET = 4096, this.SPI_REG_BASE = 1072963584, this.SPI_USR_OFFS = 28, this.SPI_USR1_OFFS = 32, this.SPI_USR2_OFFS = 36, this.SPI_W0_OFFS = 128, this.SPI_MOSI_DLEN_OFFS = 40, this.SPI_MISO_DLEN_OFFS = 44, this.TEXT_START = re, this.ENTRY = ae, this.DATA_START = ge, this.ROM_DATA = he, this.ROM_TEXT = ne
        }
        async read_efuse(A, t) {
            const e = this.EFUSE_RD_REG_BASE + 4 * t;
            return A.debug("Read efuse " + e), await A.read_reg(e)
        }
        async get_pkg_version(A) {
            const t = await this.read_efuse(A, 3);
            let e = t >> 9 & 7;
            return e += (t >> 2 & 1) << 3, e
        }
        async get_chip_revision(A) {
            const t = await this.read_efuse(A, 3),
                e = await this.read_efuse(A, 5),
                i = await A.read_reg(this.DR_REG_SYSCON_BASE + 124);
            return 0 != (t >> 15 & 1) ? 0 != (e >> 20 & 1) ? 0 != (i >> 31 & 1) ? 3 : 2 : 1 : 0
        }
        async get_chip_description(A) {
            const t = ["ESP32-D0WDQ6", "ESP32-D0WD", "ESP32-D2WD", "", "ESP32-U4WDH", "ESP32-PICO-D4", "ESP32-PICO-V3-02"];
            let e = "";
            const i = await this.get_pkg_version(A),
                s = await this.get_chip_revision(A),
                a = 3 == s;
            return 0 != (1 & await this.read_efuse(A, 3)) && (t[0] = "ESP32-S0WDQ6", t[1] = "ESP32-S0WD"), a && (t[5] = "ESP32-PICO-V3"), e = i >= 0 && i <= 6 ? t[i] : "Unknown ESP32", !a || 0 !== i && 1 !== i || (e += "-V3"), e + " (revision " + s + ")"
        }
        async get_chip_features(A) {
            const t = ["Wi-Fi"],
                e = await this.read_efuse(A, 3);
            0 === (2 & e) && t.push(" BT");
            0 !== (1 & e) ? t.push(" Single Core") : t.push(" Dual Core");
            if (0 !== (8192 & e)) {
                0 !== (4096 & e) ? t.push(" 160MHz") : t.push(" 240MHz")
            }
            const i = await this.get_pkg_version(A); - 1 !== [2, 4, 5, 6].indexOf(i) && t.push(" Embedded Flash"), 6 === i && t.push(" Embedded PSRAM");
            0 !== (await this.read_efuse(A, 4) >> 8 & 31) && t.push(" VRef calibration in efuse");
            0 !== (e >> 14 & 1) && t.push(" BLK3 partially reserved");
            const s = 3 & await this.read_efuse(A, 6);
            return t.push(" Coding Scheme " + ["None", "3/4", "Repeat (UNSUPPORTED)", "Invalid"][s]), t
        }
        async get_crystal_freq(A) {
            const t = await A.read_reg(this.UART_CLKDIV_REG) & this.UART_CLKDIV_MASK,
                e = A.transport.baudrate * t / 1e6 / this.XTAL_CLK_DIVIDER;
            let i;
            return i = e > 33 ? 40 : 26, Math.abs(i - e) > 1 && A.info("WARNING: Unsupported crystal in use"), i
        }
        _d2h(A) {
            const t = (+A).toString(16);
            return 1 === t.length ? "0" + t : t
        }
        async read_mac(A) {
            let t = await this.read_efuse(A, 1);
            t >>>= 0;
            let e = await this.read_efuse(A, 2);
            e >>>= 0;
            const i = new Uint8Array(6);
            return i[0] = e >> 8 & 255, i[1] = 255 & e, i[2] = t >> 24 & 255, i[3] = t >> 16 & 255, i[4] = t >> 8 & 255, i[5] = 255 & t, this._d2h(i[0]) + ":" + this._d2h(i[1]) + ":" + this._d2h(i[2]) + ":" + this._d2h(i[3]) + ":" + this._d2h(i[4]) + ":" + this._d2h(i[5])
        }
    }
}),
    Ee = 1077413532,
    _e = "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",
    we = 1077411840,
    Be = "IGvIP3YKOEDGCjhAHgs4QMILOEAuDDhA3As4QEIJOEB+CzhAvgs4QDILOEDyCDhAZgs4QPIIOEBQCjhAlgo4QMYKOEAeCzhAYgo4QKYJOEDWCThAXgo4QIAOOEDGCjhARg04QDgOOEAyCDhAYA44QDIIOEAyCDhAMgg4QDIIOEAyCDhAMgg4QDIIOEAyCDhA4gw4QDIIOEBkDThAOA44QA==",
    Ie = 1070164912;
var ce = Object.freeze({
    __proto__: null,
    ESP32C3ROM: class extends se {
        constructor() {
            super(...arguments), this.CHIP_NAME = "ESP32-C3", this.IMAGE_CHIP_ID = 5, this.EFUSE_BASE = 1610647552, this.MAC_EFUSE_REG = this.EFUSE_BASE + 68, this.UART_CLKDIV_REG = 1072955412, this.UART_CLKDIV_MASK = 1048575, this.UART_DATE_REG_ADDR = 1610612860, this.FLASH_WRITE_SIZE = 1024, this.BOOTLOADER_FLASH_OFFSET = 0, this.FLASH_SIZES = {
                "1MB": 0,
                "2MB": 16,
                "4MB": 32,
                "8MB": 48,
                "16MB": 64
            }, this.SPI_REG_BASE = 1610620928, this.SPI_USR_OFFS = 24, this.SPI_USR1_OFFS = 28, this.SPI_USR2_OFFS = 32, this.SPI_MOSI_DLEN_OFFS = 36, this.SPI_MISO_DLEN_OFFS = 40, this.SPI_W0_OFFS = 88, this.TEXT_START = we, this.ENTRY = Ee, this.DATA_START = Ie, this.ROM_DATA = Be, this.ROM_TEXT = _e
        }
        async get_pkg_version(A) {
            const t = this.EFUSE_BASE + 68 + 12;
            return await A.read_reg(t) >> 21 & 7
        }
        async get_chip_revision(A) {
            const t = this.EFUSE_BASE + 68 + 12;
            return (await A.read_reg(t) & 7 << 18) >> 18
        }
        async get_chip_description(A) {
            let t;
            t = 0 === await this.get_pkg_version(A) ? "ESP32-C3" : "unknown ESP32-C3";
            return t += " (revision " + await this.get_chip_revision(A) + ")", t
        }
        async get_chip_features(A) {
            return ["Wi-Fi"]
        }
        async get_crystal_freq(A) {
            return 40
        }
        _d2h(A) {
            const t = (+A).toString(16);
            return 1 === t.length ? "0" + t : t
        }
        async read_mac(A) {
            let t = await A.read_reg(this.MAC_EFUSE_REG);
            t >>>= 0;
            let e = await A.read_reg(this.MAC_EFUSE_REG + 4);
            e = e >>> 0 & 65535;
            const i = new Uint8Array(6);
            return i[0] = e >> 8 & 255, i[1] = 255 & e, i[2] = t >> 24 & 255, i[3] = t >> 16 & 255, i[4] = t >> 8 & 255, i[5] = 255 & t, this._d2h(i[0]) + ":" + this._d2h(i[1]) + ":" + this._d2h(i[2]) + ":" + this._d2h(i[3]) + ":" + this._d2h(i[4]) + ":" + this._d2h(i[5])
        }
        get_erase_size(A, t) {
            return t
        }
    }
}),
    Ce = 1082132112,
    le = "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",
    de = 1082130432,
    Qe = "HCuEQEIKgECSCoBA6gqAQI4LgED6C4BAqAuAQA4JgEBKC4BAiguAQP4KgEC+CIBAMguAQL4IgEAcCoBAYgqAQJIKgEDqCoBALgqAQHIJgECiCYBAKgqAQEwOgECSCoBAEg2AQAQOgED+B4BALA6AQP4HgED+B4BA/geAQP4HgED+B4BA/geAQP4HgED+B4BArgyAQP4HgEAwDYBABA6AQA==",
    fe = 1082469292;
var De = Object.freeze({
    __proto__: null,
    ESP32C6ROM: class extends se {
        constructor() {
            super(...arguments), this.CHIP_NAME = "ESP32-C6", this.IMAGE_CHIP_ID = 13, this.EFUSE_BASE = 1611335680, this.MAC_EFUSE_REG = this.EFUSE_BASE + 68, this.UART_CLKDIV_REG = 1072955412, this.UART_CLKDIV_MASK = 1048575, this.UART_DATE_REG_ADDR = 1610612860, this.FLASH_WRITE_SIZE = 1024, this.BOOTLOADER_FLASH_OFFSET = 0, this.FLASH_SIZES = {
                "1MB": 0,
                "2MB": 16,
                "4MB": 32,
                "8MB": 48,
                "16MB": 64
            }, this.SPI_REG_BASE = 1610620928, this.SPI_USR_OFFS = 24, this.SPI_USR1_OFFS = 28, this.SPI_USR2_OFFS = 32, this.SPI_MOSI_DLEN_OFFS = 36, this.SPI_MISO_DLEN_OFFS = 40, this.SPI_W0_OFFS = 88, this.TEXT_START = de, this.ENTRY = Ce, this.DATA_START = fe, this.ROM_DATA = Qe, this.ROM_TEXT = le
        }
        async get_pkg_version(A) {
            const t = this.EFUSE_BASE + 68 + 12;
            return await A.read_reg(t) >> 21 & 7
        }
        async get_chip_revision(A) {
            const t = this.EFUSE_BASE + 68 + 12;
            return (await A.read_reg(t) & 7 << 18) >> 18
        }
        async get_chip_description(A) {
            let t;
            t = 0 === await this.get_pkg_version(A) ? "ESP32-C6" : "unknown ESP32-C6";
            return t += " (revision " + await this.get_chip_revision(A) + ")", t
        }
        async get_chip_features(A) {
            return ["Wi-Fi"]
        }
        async get_crystal_freq(A) {
            return 40
        }
        _d2h(A) {
            const t = (+A).toString(16);
            return 1 === t.length ? "0" + t : t
        }
        async read_mac(A) {
            let t = await A.read_reg(this.MAC_EFUSE_REG);
            t >>>= 0;
            let e = await A.read_reg(this.MAC_EFUSE_REG + 4);
            e = e >>> 0 & 65535;
            const i = new Uint8Array(6);
            return i[0] = e >> 8 & 255, i[1] = 255 & e, i[2] = t >> 24 & 255, i[3] = t >> 16 & 255, i[4] = t >> 8 & 255, i[5] = 255 & t, this._d2h(i[0]) + ":" + this._d2h(i[1]) + ":" + this._d2h(i[2]) + ":" + this._d2h(i[3]) + ":" + this._d2h(i[4]) + ":" + this._d2h(i[5])
        }
        get_erase_size(A, t) {
            return t
        }
    }
}),
    Me = 1082132112,
    Se = "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",
    Re = 1082130432,
    ue = "EACDQEIKgECSCoBA6gqAQI4LgED6C4BAqAuAQA4JgEBKC4BAiguAQP4KgEC+CIBAMguAQL4IgEAcCoBAYgqAQJIKgEDqCoBALgqAQHIJgECiCYBAKgqAQFIOgECSCoBAEg2AQAoOgED+B4BAMg6AQP4HgED+B4BA/geAQP4HgED+B4BA/geAQP4HgED+B4BArgyAQP4HgEAwDYBACg6AQA==",
    pe = 1082403756;
var ye = Object.freeze({
    __proto__: null,
    ESP32H2ROM: class extends se {
        constructor() {
            super(...arguments), this.CHIP_NAME = "ESP32-H2", this.IMAGE_CHIP_ID = 16, this.EFUSE_BASE = 1610647552, this.MAC_EFUSE_REG = this.EFUSE_BASE + 68, this.UART_CLKDIV_REG = 1072955412, this.UART_CLKDIV_MASK = 1048575, this.UART_DATE_REG_ADDR = 1610612860, this.FLASH_WRITE_SIZE = 1024, this.BOOTLOADER_FLASH_OFFSET = 0, this.FLASH_SIZES = {
                "1MB": 0,
                "2MB": 16,
                "4MB": 32,
                "8MB": 48,
                "16MB": 64
            }, this.SPI_REG_BASE = 1610620928, this.SPI_USR_OFFS = 24, this.SPI_USR1_OFFS = 28, this.SPI_USR2_OFFS = 32, this.SPI_MOSI_DLEN_OFFS = 36, this.SPI_MISO_DLEN_OFFS = 40, this.SPI_W0_OFFS = 88, this.USB_RAM_BLOCK = 2048, this.UARTDEV_BUF_NO_USB = 3, this.UARTDEV_BUF_NO = 1070526796, this.TEXT_START = Re, this.ENTRY = Me, this.DATA_START = pe, this.ROM_DATA = ue, this.ROM_TEXT = Se
        }
        async get_chip_description(A) {
            return this.CHIP_NAME
        }
        async get_chip_features(A) {
            return ["BLE", "IEEE802.15.4"]
        }
        async get_crystal_freq(A) {
            return 32
        }
        _d2h(A) {
            const t = (+A).toString(16);
            return 1 === t.length ? "0" + t : t
        }
        async _post_connect(A) {
            const t = 255 & await A.read_reg(this.UARTDEV_BUF_NO);
            A.debug("In _post_connect " + t), t == this.UARTDEV_BUF_NO_USB && (A.ESP_RAM_BLOCK = this.USB_RAM_BLOCK)
        }
        async read_mac(A) {
            let t = await A.read_reg(this.MAC_EFUSE_REG);
            t >>>= 0;
            let e = await A.read_reg(this.MAC_EFUSE_REG + 4);
            e = e >>> 0 & 65535;
            const i = new Uint8Array(6);
            return i[0] = e >> 8 & 255, i[1] = 255 & e, i[2] = t >> 24 & 255, i[3] = t >> 16 & 255, i[4] = t >> 8 & 255, i[5] = 255 & t, this._d2h(i[0]) + ":" + this._d2h(i[1]) + ":" + this._d2h(i[2]) + ":" + this._d2h(i[3]) + ":" + this._d2h(i[4]) + ":" + this._d2h(i[5])
        }
        get_erase_size(A, t) {
            return t
        }
    }
}),
    me = 1077381696,
    ke = "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",
    Fe = 1077379072,
    be = "ZCvKP8qNN0CvjjdAcJM3QDqPN0DPjjdAOo83QJmPN0BmkDdA2ZA3QIGQN0BVjTdA/I83QFiQN0C8jzdA+5A3QOaPN0D7kDdAnY43QPqON0A6jzdAmY83QLWON0CWjTdAvJE3QDaTN0ByjDdAVpM3QHKMN0ByjDdAcow3QHKMN0ByjDdAcow3QHKMN0ByjDdAVpE3QHKMN0BRkjdANpM3QAQInwAAAAAAAAAYAQQIBQAAAAAAAAAIAQQIBgAAAAAAAAAAAQQIIQAAAAAAIAAAEQQI3AAAAAAAIAAAEQQIDAAAAAAAIAAAAQQIEgAAAAAAIAAAESAoDAAQAQAA",
    He = 1070279668;
var Ge = Object.freeze({
    __proto__: null,
    ESP32S3ROM: class extends se {
        constructor() {
            super(...arguments), this.CHIP_NAME = "ESP32-S3", this.IMAGE_CHIP_ID = 9, this.EFUSE_BASE = 1610641408, this.MAC_EFUSE_REG = this.EFUSE_BASE + 68, this.UART_CLKDIV_REG = 1610612756, this.UART_CLKDIV_MASK = 1048575, this.UART_DATE_REG_ADDR = 1610612864, this.FLASH_WRITE_SIZE = 1024, this.BOOTLOADER_FLASH_OFFSET = 0, this.FLASH_SIZES = {
                "1MB": 0,
                "2MB": 16,
                "4MB": 32,
                "8MB": 48,
                "16MB": 64
            }, this.SPI_REG_BASE = 1610620928, this.SPI_USR_OFFS = 24, this.SPI_USR1_OFFS = 28, this.SPI_USR2_OFFS = 32, this.SPI_MOSI_DLEN_OFFS = 36, this.SPI_MISO_DLEN_OFFS = 40, this.SPI_W0_OFFS = 88, this.USB_RAM_BLOCK = 2048, this.UARTDEV_BUF_NO_USB = 3, this.UARTDEV_BUF_NO = 1070526796, this.TEXT_START = Fe, this.ENTRY = me, this.DATA_START = He, this.ROM_DATA = be, this.ROM_TEXT = ke
        }
        async get_chip_description(A) {
            return "ESP32-S3"
        }
        async get_chip_features(A) {
            return ["Wi-Fi", "BLE"]
        }
        async get_crystal_freq(A) {
            return 40
        }
        _d2h(A) {
            const t = (+A).toString(16);
            return 1 === t.length ? "0" + t : t
        }
        async _post_connect(A) {
            const t = 255 & await A.read_reg(this.UARTDEV_BUF_NO);
            A.debug("In _post_connect " + t), t == this.UARTDEV_BUF_NO_USB && (A.ESP_RAM_BLOCK = this.USB_RAM_BLOCK)
        }
        async read_mac(A) {
            let t = await A.read_reg(this.MAC_EFUSE_REG);
            t >>>= 0;
            let e = await A.read_reg(this.MAC_EFUSE_REG + 4);
            e = e >>> 0 & 65535;
            const i = new Uint8Array(6);
            return i[0] = e >> 8 & 255, i[1] = 255 & e, i[2] = t >> 24 & 255, i[3] = t >> 16 & 255, i[4] = t >> 8 & 255, i[5] = 255 & t, this._d2h(i[0]) + ":" + this._d2h(i[1]) + ":" + this._d2h(i[2]) + ":" + this._d2h(i[3]) + ":" + this._d2h(i[4]) + ":" + this._d2h(i[5])
        }
        get_erase_size(A, t) {
            return t
        }
    }
}),
    Te = 1073907696,
    Pe = "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",
    Ke = 1073905664,
    Ye = "ZCv9PzaLAkDBiwJAhpACQEqMAkDjiwJASowCQKmMAkByjQJA5Y0CQI2NAkDAigJAC40CQGSNAkDMjAJACI4CQPaMAkAIjgJAr4sCQA6MAkBKjAJAqYwCQMeLAkACiwJAx44CQD2QAkDYiQJAZZACQNiJAkDYiQJA2IkCQNiJAkDYiQJA2IkCQNiJAkDYiQJAZI4CQNiJAkBZjwJAPZACQA==",
    xe = 1073622012;
var Oe = Object.freeze({
    __proto__: null,
    ESP32S2ROM: class extends se {
        constructor() {
            super(...arguments), this.CHIP_NAME = "ESP32-S2", this.IMAGE_CHIP_ID = 2, this.MAC_EFUSE_REG = 1061265476, this.EFUSE_BASE = 1061265408, this.UART_CLKDIV_REG = 1061158932, this.UART_CLKDIV_MASK = 1048575, this.UART_DATE_REG_ADDR = 1610612856, this.FLASH_WRITE_SIZE = 1024, this.BOOTLOADER_FLASH_OFFSET = 4096, this.FLASH_SIZES = {
                "1MB": 0,
                "2MB": 16,
                "4MB": 32,
                "8MB": 48,
                "16MB": 64
            }, this.SPI_REG_BASE = 1061167104, this.SPI_USR_OFFS = 24, this.SPI_USR1_OFFS = 28, this.SPI_USR2_OFFS = 32, this.SPI_W0_OFFS = 88, this.SPI_MOSI_DLEN_OFFS = 36, this.SPI_MISO_DLEN_OFFS = 40, this.TEXT_START = Ke, this.ENTRY = Te, this.DATA_START = xe, this.ROM_DATA = Ye, this.ROM_TEXT = Pe
        }
        async get_pkg_version(A) {
            const t = this.EFUSE_BASE + 68 + 12;
            return await A.read_reg(t) >> 21 & 15
        }
        async get_chip_description(A) {
            const t = ["ESP32-S2", "ESP32-S2FH16", "ESP32-S2FH32"],
                e = await this.get_pkg_version(A);
            return e >= 0 && e <= 2 ? t[e] : "unknown ESP32-S2"
        }
        async get_chip_features(A) {
            const t = ["Wi-Fi"],
                e = await this.get_pkg_version(A);
            1 == e ? t.push("Embedded 2MB Flash") : 2 == e && t.push("Embedded 4MB Flash");
            const i = this.EFUSE_BASE + 92 + 16;
            return 1 == (await A.read_reg(i) >> 4 & 7) && t.push("ADC and temperature sensor calibration in BLK2 of efuse"), t
        }
        async get_crystal_freq(A) {
            return 40
        }
        _d2h(A) {
            const t = (+A).toString(16);
            return 1 === t.length ? "0" + t : t
        }
        async read_mac(A) {
            let t = await A.read_reg(this.MAC_EFUSE_REG);
            t >>>= 0;
            let e = await A.read_reg(this.MAC_EFUSE_REG + 4);
            e = e >>> 0 & 65535;
            const i = new Uint8Array(6);
            return i[0] = e >> 8 & 255, i[1] = 255 & e, i[2] = t >> 24 & 255, i[3] = t >> 16 & 255, i[4] = t >> 8 & 255, i[5] = 255 & t, this._d2h(i[0]) + ":" + this._d2h(i[1]) + ":" + this._d2h(i[2]) + ":" + this._d2h(i[3]) + ":" + this._d2h(i[4]) + ":" + this._d2h(i[5])
        }
        get_erase_size(A, t) {
            return t
        }
    }
}),
    Ue = 1074843652,
    ve = "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",
    Le = 1074843648,
    Je = "CIH+PwUFBAACAwcAAwMLALnXEEDv1xBAHdgQQLrYEEBo5xBAHtkQQHTZEEDA2RBAaOcQQILaEED/2hBAwNsQQGjnEEBo5xBAWNwQQGjnEEA33xBAAOAQQDvgEEBo5xBAaOcQQNfgEEBo5xBAv+EQQGXiEECj4xBAY+QQQDTlEEBo5xBAaOcQQGjnEEBo5xBAYuYQQGjnEEBX5xBAkN0QQI/YEECm5RBAq9oQQPzZEEBo5xBA7OYQQDHnEEBo5xBAaOcQQGjnEEBo5xBAaOcQQGjnEEBo5xBAaOcQQCLaEEBf2hBAvuUQQAEAAAACAAAAAwAAAAQAAAAFAAAABwAAAAkAAAANAAAAEQAAABkAAAAhAAAAMQAAAEEAAABhAAAAgQAAAMEAAAABAQAAgQEAAAECAAABAwAAAQQAAAEGAAABCAAAAQwAAAEQAAABGAAAASAAAAEwAAABQAAAAWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAgAAAAIAAAADAAAAAwAAAAQAAAAEAAAABQAAAAUAAAAGAAAABgAAAAcAAAAHAAAACAAAAAgAAAAJAAAACQAAAAoAAAAKAAAACwAAAAsAAAAMAAAADAAAAA0AAAANAAAAAAAAAAAAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAANAAAADwAAABEAAAATAAAAFwAAABsAAAAfAAAAIwAAACsAAAAzAAAAOwAAAEMAAABTAAAAYwAAAHMAAACDAAAAowAAAMMAAADjAAAAAgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAABAAAAAgAAAAIAAAACAAAAAgAAAAMAAAADAAAAAwAAAAMAAAAEAAAABAAAAAQAAAAEAAAABQAAAAUAAAAFAAAABQAAAAAAAAAAAAAAAAAAABAREgAIBwkGCgULBAwDDQIOAQ8AAQEAAAEAAAAEAAAA",
    ze = 1073720488;
var Ne = Object.freeze({
    __proto__: null,
    ESP8266ROM: class extends se {
        constructor() {
            super(...arguments), this.CHIP_NAME = "ESP8266", this.CHIP_DETECT_MAGIC_VALUE = [4293968129], this.EFUSE_RD_REG_BASE = 1072693328, this.UART_CLKDIV_REG = 1610612756, this.UART_CLKDIV_MASK = 1048575, this.XTAL_CLK_DIVIDER = 2, this.FLASH_WRITE_SIZE = 16384, this.BOOTLOADER_FLASH_OFFSET = 0, this.UART_DATE_REG_ADDR = 0, this.FLASH_SIZES = {
                "512KB": 0,
                "256KB": 16,
                "1MB": 32,
                "2MB": 48,
                "4MB": 64,
                "2MB-c1": 80,
                "4MB-c1": 96,
                "8MB": 128,
                "16MB": 144
            }, this.SPI_REG_BASE = 1610613248, this.SPI_USR_OFFS = 28, this.SPI_USR1_OFFS = 32, this.SPI_USR2_OFFS = 36, this.SPI_MOSI_DLEN_OFFS = 0, this.SPI_MISO_DLEN_OFFS = 0, this.SPI_W0_OFFS = 64, this.TEXT_START = Le, this.ENTRY = Ue, this.DATA_START = ze, this.ROM_DATA = Je, this.ROM_TEXT = ve, this.get_chip_features = async A => {
                const t = ["WiFi"];
                return "ESP8285" == await this.get_chip_description(A) && t.push("Embedded Flash"), t
            }
        }
        async read_efuse(A, t) {
            const e = this.EFUSE_RD_REG_BASE + 4 * t;
            return A.debug("Read efuse " + e), await A.read_reg(e)
        }
        async get_chip_description(A) {
            const t = await this.read_efuse(A, 2);
            return 0 != (16 & await this.read_efuse(A, 0) | 65536 & t) ? "ESP8285" : "ESP8266EX"
        }
        async get_crystal_freq(A) {
            const t = await A.read_reg(this.UART_CLKDIV_REG) & this.UART_CLKDIV_MASK,
                e = A.transport.baudrate * t / 1e6 / this.XTAL_CLK_DIVIDER;
            let i;
            return i = e > 33 ? 40 : 26, Math.abs(i - e) > 1 && A.info("WARNING: Detected crystal freq " + e + "MHz is quite different to normalized freq " + i + "MHz. Unsupported crystal in use?"), i
        }
        _d2h(A) {
            const t = (+A).toString(16);
            return 1 === t.length ? "0" + t : t
        }
        async read_mac(A) {
            let t = await this.read_efuse(A, 0);
            t >>>= 0;
            let e = await this.read_efuse(A, 1);
            e >>>= 0;
            let i = await this.read_efuse(A, 3);
            i >>>= 0;
            const s = new Uint8Array(6);
            return 0 != i ? (s[0] = i >> 16 & 255, s[1] = i >> 8 & 255, s[2] = 255 & i) : 0 == (e >> 16 & 255) ? (s[0] = 24, s[1] = 254, s[2] = 52) : 1 == (e >> 16 & 255) ? (s[0] = 172, s[1] = 208, s[2] = 116) : A.error("Unknown OUI"), s[3] = e >> 8 & 255, s[4] = 255 & e, s[5] = t >> 24 & 255, this._d2h(s[0]) + ":" + this._d2h(s[1]) + ":" + this._d2h(s[2]) + ":" + this._d2h(s[3]) + ":" + this._d2h(s[4]) + ":" + this._d2h(s[5])
        }
        get_erase_size(A, t) {
            return t
        }
    }
});
export {
    ee as ESPLoader, ie as Transport
};